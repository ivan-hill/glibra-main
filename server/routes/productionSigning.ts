import { Router } from "express";
import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  productionProjects,
  releaseRequests,
  executedReleases,
  releaseAuditEvents,
  chainOfTitleItems,
} from "@shared/schema";
import { productionAgreementTemplates } from "../productionAgreementTemplates";
import { createTextPdf } from "../productionPdf";

const router = Router();

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function findRequest(token: string) {
  const [request] = await db.select().from(releaseRequests)
    .where(eq(releaseRequests.tokenHash, hashToken(token))).limit(1);
  return request;
}

router.get("/:token", async (req, res) => {
  const request = await findRequest(req.params.token);
  if (!request) return res.status(404).json({ message: "Agreement not found." });
  if (request.expiresAt && request.expiresAt < new Date() && request.status !== "signed") {
    return res.status(410).json({ message: "This signing link has expired." });
  }

  const [project] = await db.select().from(productionProjects)
    .where(eq(productionProjects.id, request.productionId)).limit(1);

  if (!request.viewedAt) {
    await db.update(releaseRequests)
      .set({ viewedAt: new Date(), status: request.status === "pending" ? "viewed" : request.status })
      .where(eq(releaseRequests.id, request.id));
    await db.insert(releaseAuditEvents).values({
      requestId: request.id,
      eventType: "viewed",
      metadata: { userAgent: req.get("user-agent") || null },
    });
  }

  const template = productionAgreementTemplates[request.documentType];
  res.json({
    productionTitle: project?.title || "Glibra Production",
    agreementTitle: template?.title || request.documentType,
    signerName: request.signerName,
    signerEmail: request.signerEmail,
    signerRole: request.signerRole,
    document: request.renderedDocument,
    status: request.status,
    signedAt: request.signedAt,
  });
});

router.post("/:token/sign", async (req, res) => {
  const request = await findRequest(req.params.token);
  if (!request) return res.status(404).json({ message: "Agreement not found." });
  if (request.status === "signed") return res.status(409).json({ message: "Agreement already signed." });
  if (request.expiresAt && request.expiresAt < new Date()) {
    return res.status(410).json({ message: "This signing link has expired." });
  }

  const legalName = String(req.body?.legalName || "").trim();
  const signatureText = String(req.body?.signatureText || "").trim();
  const electronicConsent = req.body?.electronicConsent === true;

  if (!legalName || !signatureText || !electronicConsent) {
    return res.status(400).json({ message: "Legal name, signature, and electronic-record consent are required." });
  }

  const signedAt = new Date();
  const executedDocument =
    request.renderedDocument +
    "\n\n---\n\n# ELECTRONIC SIGNATURE\n\n" +
    "Signer legal name: " + legalName + "\n\n" +
    "Signer email: " + request.signerEmail + "\n\n" +
    "Electronic signature: " + signatureText + "\n\n" +
    "Signed at: " + signedAt.toISOString() + "\n\n" +
    "Electronic-record consent: Yes";
  const documentSha256 = crypto.createHash("sha256").update(executedDocument).digest("hex");

  await db.transaction(async tx => {
    await tx.insert(executedReleases).values({
      requestId: request.id,
      signerLegalName: legalName,
      signerEmail: request.signerEmail,
      signatureText,
      electronicConsent: true,
      documentSha256,
      executedDocument,
      ipAddress: req.ip || null,
      userAgent: req.get("user-agent") || null,
      signedAt,
    });

    await tx.update(releaseRequests)
      .set({ status: "signed", signedAt })
      .where(eq(releaseRequests.id, request.id));

    await tx.update(chainOfTitleItems)
      .set({ status: "cleared", updatedAt: signedAt })
      .where(eq(chainOfTitleItems.releaseRequestId, request.id));

    await tx.insert(releaseAuditEvents).values({
      requestId: request.id,
      eventType: "signed",
      metadata: { documentSha256 },
    });
  });

  res.json({
    ok: true,
    signedAt: signedAt.toISOString(),
    documentSha256,
    pdfPath: "/api/production-sign/" + req.params.token + "/pdf",
  });
});

router.get("/:token/pdf", async (req, res) => {
  const request = await findRequest(req.params.token);
  if (!request || request.status !== "signed") {
    return res.status(404).json({ message: "Executed agreement not found." });
  }
  const [executed] = await db.select().from(executedReleases)
    .where(eq(executedReleases.requestId, request.id)).limit(1);
  if (!executed) return res.status(404).json({ message: "Executed agreement not found." });

  const template = productionAgreementTemplates[request.documentType];
  const pdf = createTextPdf(template?.title || "Glibra Executed Agreement", executed.executedDocument);
  const safeName = (template?.title || "glibra-agreement").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="' + safeName + '-executed.pdf"');
  res.send(pdf);
});

export default router;

import { Router } from "express";
import crypto from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { isAuthenticated } from "../replitAuth";
import {
  productionProjects,
  releaseRequests,
  chainOfTitleItems,
} from "@shared/schema";
import { productionAgreementTemplates } from "../productionAgreementTemplates";

const router = Router();

function requireProductionAdmin(req: any, res: any, next: any) {
  const email = String(req.user?.claims?.email || "").toLowerCase();
  const allowed = String(process.env.PRODUCTION_ADMIN_EMAILS || "")
    .split(",")
    .map(v => v.trim().toLowerCase())
    .filter(Boolean);
  if (!email || !allowed.includes(email)) {
    return res.status(403).json({ message: "Production admin access required." });
  }
  next();
}

router.use(isAuthenticated, requireProductionAdmin);

router.get("/templates", (_req, res) => {
  res.json(Object.entries(productionAgreementTemplates).map(([id, template]) => ({
    id,
    title: template.title,
    version: template.version,
  })));
});

router.get("/projects", async (_req, res) => {
  const projects = await db.select().from(productionProjects).orderBy(desc(productionProjects.createdAt));
  res.json(projects);
});

router.post("/projects", async (req, res) => {
  const title = String(req.body?.title || "").trim();
  if (!title) return res.status(400).json({ message: "Project title is required." });
  const slugBase = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "production";
  const slug = slugBase + "-" + crypto.randomBytes(3).toString("hex");
  const [project] = await db.insert(productionProjects).values({
    title,
    slug,
    productionEntity: req.body?.productionEntity ? String(req.body.productionEntity).trim() : null,
    notes: req.body?.notes ? String(req.body.notes).trim() : null,
  }).returning();
  res.status(201).json(project);
});

router.get("/projects/:projectId/releases", async (req, res) => {
  const releases = await db.select().from(releaseRequests)
    .where(eq(releaseRequests.productionId, req.params.projectId))
    .orderBy(desc(releaseRequests.createdAt));
  res.json(releases);
});

router.post("/projects/:projectId/releases", async (req, res) => {
  const documentType = String(req.body?.documentType || "");
  const template = productionAgreementTemplates[documentType];
  if (!template) return res.status(400).json({ message: "Unknown agreement type." });

  const signerName = String(req.body?.signerName || "").trim();
  const signerEmail = String(req.body?.signerEmail || "").trim().toLowerCase();
  if (!signerName || !signerEmail) {
    return res.status(400).json({ message: "Signer name and email are required." });
  }

  const [project] = await db.select().from(productionProjects)
    .where(eq(productionProjects.id, req.params.projectId)).limit(1);
  if (!project) return res.status(404).json({ message: "Production not found." });

  const productionTerms = String(req.body?.productionTerms || "").trim();
  const renderedDocument =
    template.body +
    "\n\n---\n\n# PRODUCTION-SPECIFIC TERMS\n\n" +
    "Production: " + project.title + "\n\n" +
    "Signer: " + signerName + "\n\n" +
    "Signer role: " + String(req.body?.signerRole || "Participant") + "\n\n" +
    (productionTerms || "No additional production-specific terms were entered.");

  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = req.body?.expiresAt ? new Date(req.body.expiresAt) : null;

  const [release] = await db.insert(releaseRequests).values({
    productionId: project.id,
    documentType,
    templateVersion: template.version,
    signerName,
    signerEmail,
    signerRole: req.body?.signerRole ? String(req.body.signerRole).trim() : null,
    renderedDocument,
    tokenHash,
    expiresAt,
  }).returning();

  await db.insert(chainOfTitleItems).values({
    productionId: project.id,
    category: documentType,
    label: template.title + " — " + signerName,
    status: "pending",
    releaseRequestId: release.id,
  });

  res.status(201).json({
    release,
    signingPath: "/production-sign/" + token,
  });
});

router.get("/projects/:projectId/chain-of-title", async (req, res) => {
  const items = await db.select().from(chainOfTitleItems)
    .where(eq(chainOfTitleItems.productionId, req.params.projectId))
    .orderBy(desc(chainOfTitleItems.updatedAt));
  res.json(items);
});

router.patch("/chain-of-title/:itemId", async (req, res) => {
  const status = String(req.body?.status || "");
  if (!["open", "pending", "cleared", "blocked", "not_applicable"].includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }
  const [item] = await db.update(chainOfTitleItems)
    .set({
      status,
      notes: req.body?.notes === undefined ? undefined : String(req.body.notes),
      updatedAt: new Date(),
    })
    .where(eq(chainOfTitleItems.id, req.params.itemId))
    .returning();
  if (!item) return res.status(404).json({ message: "Item not found." });
  res.json(item);
});

export default router;

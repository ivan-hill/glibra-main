import { Router } from "express";
import { db } from "../db";
import { mediaParticipation, insertMediaParticipationSchema } from "@shared/schema";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = insertMediaParticipationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Please review the form fields and try again." });
  }

  const [record] = await db.insert(mediaParticipation).values(parsed.data).returning({ id: mediaParticipation.id });
  res.status(201).json({ ok: true, id: record.id });
});

export default router;

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import authRoutes from "./routes/auth";
import billingRoutes from "./routes/billing";
import plansRoutes from "./routes/plans";
import productionRightsRoutes from "./routes/productionRights";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth (OpenID Connect)
  await setupAuth(app);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount API routes
  app.use('/api/auth-legacy', authRoutes);
  app.use('/api/billing', billingRoutes);
  app.use('/api/plans', plansRoutes);
  app.use('/api/production-rights', productionRightsRoutes);

  // Legacy storage routes (if needed)
  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}

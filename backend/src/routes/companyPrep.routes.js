import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { deletePrepPlan, generatePrepPlan, getPrepPlans } from "../controllers/companyPrep.controller.js";

const companyPrepRoutes = express.Router();
companyPrepRoutes.use(authMiddleware);
companyPrepRoutes.post("/generate", generatePrepPlan);
companyPrepRoutes.get("/plans", getPrepPlans);
companyPrepRoutes.delete("/plans/:id", deletePrepPlan);

export default companyPrepRoutes;

import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    createProblemDiscussion,
    deleteProblemDiscussion,
    getProblemDiscussions,
} from "../controllers/discussion.controller.js";

const discussionRoutes = express.Router();

discussionRoutes.get("/:problemId", authMiddleware, getProblemDiscussions);
discussionRoutes.post("/:problemId", authMiddleware, createProblemDiscussion);
discussionRoutes.delete("/:discussionId", authMiddleware, deleteProblemDiscussion);

export default discussionRoutes;

import { randomUUID } from "node:crypto";
import { db } from "../libs/db.js";

export const getProblemDiscussions = async (req, res) => {
    const { problemId } = req.params;

    try {
        const discussions = await db.$queryRaw`
            SELECT d."id", d."content", d."userId", d."problemId", d."createdAt", d."updatedAt",
                   json_build_object(
                       'id', u."id",
                       'name', u."name",
                       'image', u."image",
                       'role', u."role"
                   ) AS "user"
            FROM "Discussion" d
            JOIN "User" u ON u."id" = d."userId"
            WHERE d."problemId" = ${problemId}
            ORDER BY d."createdAt" DESC
        `;

        return res.status(200).json({ success: true, discussions });
    } catch (error) {
        console.error("Error fetching discussions:", error);
        return res.status(500).json({ error: "Failed to load discussions" });
    }
};

export const createProblemDiscussion = async (req, res) => {
    const { problemId } = req.params;
    const content = typeof req.body.content === "string" ? req.body.content.trim() : "";

    if (content.length < 2 || content.length > 2000) {
        return res.status(400).json({ error: "Post must be between 2 and 2000 characters" });
    }

    try {
        const problemExists = await db.problem.findUnique({
            where: { id: problemId },
            select: { id: true },
        });

        if (!problemExists) {
            return res.status(404).json({ error: "Problem not found" });
        }

        const [discussion] = await db.$queryRaw`
            WITH inserted AS (
                INSERT INTO "Discussion" ("id", "content", "userId", "problemId", "createdAt", "updatedAt")
                VALUES (${randomUUID()}, ${content}, ${req.user.id}, ${problemId}, NOW(), NOW())
                RETURNING *
            )
            SELECT inserted."id", inserted."content", inserted."userId", inserted."problemId",
                   inserted."createdAt", inserted."updatedAt",
                   json_build_object(
                       'id', u."id",
                       'name', u."name",
                       'image', u."image",
                       'role', u."role"
                   ) AS "user"
            FROM inserted
            JOIN "User" u ON u."id" = inserted."userId"
        `;

        return res.status(201).json({ success: true, discussion });
    } catch (error) {
        console.error("Error creating discussion:", error);
        return res.status(500).json({ error: "Failed to publish discussion" });
    }
};

export const deleteProblemDiscussion = async (req, res) => {
    const { discussionId } = req.params;

    try {
        const [discussion] = await db.$queryRaw`
            SELECT "id", "userId" FROM "Discussion" WHERE "id" = ${discussionId} LIMIT 1
        `;

        if (!discussion) {
            return res.status(404).json({ error: "Discussion not found" });
        }

        if (discussion.userId !== req.user.id && req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "You cannot delete this discussion" });
        }

        await db.$executeRaw`DELETE FROM "Discussion" WHERE "id" = ${discussionId}`;
        return res.status(200).json({ success: true, message: "Discussion deleted" });
    } catch (error) {
        console.error("Error deleting discussion:", error);
        return res.status(500).json({ error: "Failed to delete discussion" });
    }
};

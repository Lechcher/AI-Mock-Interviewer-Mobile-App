import {zValidator} from "@hono/zod-validator";
import {Hono} from "hono";
import {createCustomInterview, getExploreInterviews, getHomeInterviews} from "../controllers/interviews.controller.js";
import {createCustomInterviewSchema} from "../db/validators.js"
import {authMiddleware} from "../middleware/auth.middleware.js";
import {vipMiddleware} from "../middleware/vip.middleware.js";

export const interviewsRoutes = new Hono();

interviewsRoutes.use("*", authMiddleware);
interviewsRoutes.get("/home", getHomeInterviews);
interviewsRoutes.get("/explore", getExploreInterviews);
interviewsRoutes.get("/:id", getExploreInterviews);

interviewsRoutes.post("custom", vipMiddleware, zValidator("json", createCustomInterviewSchema, (result, c) => {
    if (!result.success) {
        return c.json({
            success: false,
            error: "Invalid data",
            details: result.error.issues
        }, 400)
    }
}), createCustomInterview);
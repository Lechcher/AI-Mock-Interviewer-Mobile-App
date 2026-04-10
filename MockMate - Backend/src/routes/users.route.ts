import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z, { type ZodError } from "zod";
import {
	getProfile,
	getVipStatus,
	updateProfile,
} from "../controllers/users.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { dbMiddleware } from "../middleware/db.middleware.js";

export const usersRoutes = new Hono();

usersRoutes.use("*", dbMiddleware);
usersRoutes.use("*", authMiddleware);

const updateProfileSchema = z
	.object({
		name: z.string().min(1, "Username is required").max(255).optional(),
		avatarUrl: z
			.string()
			.url({ message: "Url must be a valid URL" })
			.max(255, "Avatar URL must not exceed 255 characters")
			.optional(),
	})
	.refine((data) => data.name !== undefined || data.avatarUrl !== undefined, {
		message: "At least one field must be provided",
		path: [],
	});

usersRoutes.get("/profile", getProfile);

usersRoutes.put(
	"/profile",
	zValidator("json", updateProfileSchema, (result, c) => {
		if (!result.success) {
			return c.json(
				{
					success: false,
					error: "Validation failed",
					details: (result.error as unknown as ZodError).issues,
				},
				400,
			);
		}
	}),
	updateProfile,
);

usersRoutes.get("/vip-status", getVipStatus);

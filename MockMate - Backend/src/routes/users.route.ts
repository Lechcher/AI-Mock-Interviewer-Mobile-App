import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { dbMiddleware } from "../middleware/db.middleware.js";
import z, { type ZodError } from "zod";
import { getProfile, updateProfile } from "../controllers/users.controller.js";
import { zValidator } from "@hono/zod-validator";

export const usersRoutes = new Hono();

usersRoutes.use("*", dbMiddleware);
usersRoutes.use("*", authMiddleware);

const updateProfileSchema = z.object({
	name: z.string().min(1, "Username is required").max(255).optional(),
	avatarUrl: z.string().url("Url must be a valid URL").optional(),
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

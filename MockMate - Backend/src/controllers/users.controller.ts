import { eq } from "drizzle-orm";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type * as schema from "../db/schema.js";
import { users } from "../db/schema.js";

type UserVariables = {
	Variables: {
		db: PostgresJsDatabase<typeof schema>;
		user: typeof schema.users.$inferSelect | undefined;
	};
};

export const getProfile = (c: Context<UserVariables>) => {
	const authUser = c.get("user");

	if (!authUser) {
		throw new HTTPException(401, {
			message: "Unauthorized: User not found",
		});
	}

	return c.json({
		success: true,
		data: {
			id: authUser.id,
			name: authUser.name,
			email: authUser.email,
			avatarUrl: authUser.avatarUrl,
			gems: authUser.gems,
			totalXp: authUser.totalXp,
			currentStreak: authUser.currentStreak,
			streakFreeze: authUser.streakFreeze,
		},
	});
};

export const updateProfile = async (c: Context<UserVariables>) => {
	const authUser = c.get("user");
	const db = c.get("db");

	if (!authUser) {
		throw new HTTPException(401, {
			message: "Unauthorized: User not found",
		});
	}

	// Validation is handled by zValidator in the route.
	const body = (await c.req.json()) as {
		name?: string;
		avatarUrl?: string;
	};

	const updatedUser = await db
		.update(users)
		.set({
			name: body.name,
			avatarUrl: body.avatarUrl,
			updatedAt: new Date(),
		})
		.where(eq(users.id, authUser.id))
		.returning();

	if (!updatedUser || updatedUser.length === 0) {
		throw new HTTPException(500, {
			message: "Failed to update user information. Please try again later.",
		});
	}

	return c.json({
		success: true,
		message: "Profile updated successfully",
		data: updatedUser[0],
	});
};

export const getVipStatus = (c: Context<UserVariables>) => {
	const authUser = c.get("user");

	if (!authUser) {
		throw new HTTPException(401, {
			message: "Unauthorized: User not found",
		});
	}

	return c.json({
		success: true,
		data: {
			isVip: authUser.isVip,
			vipPlan: authUser.vipPlan || "none",
			vipExpiry: authUser.vipNextBillingDate,
		},
	});
};

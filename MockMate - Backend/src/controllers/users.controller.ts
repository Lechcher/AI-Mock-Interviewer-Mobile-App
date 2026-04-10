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

const requireAuthUser = (c: Context<UserVariables>) => {
	const authUser = c.get("user");
	if (!authUser) {
		throw new HTTPException(401, {
			message: "Unauthorized: User not found",
		});
	}
	return authUser;
};

const toUserProfileDto = (user: typeof schema.users.$inferSelect) => ({
	id: user.id,
	name: user.name,
	email: user.email,
	avatarUrl: user.avatarUrl,
	gems: user.gems,
	totalXp: user.totalXp,
	currentStreak: user.currentStreak,
	streakFreeze: user.streakFreeze,
});

const toVipDto = (user: typeof schema.users.$inferSelect) => ({
	isVip: user.isVip,
	vipPlan: user.vipPlan || "none",
	vipExpiry: user.vipNextBillingDate,
});

export const getProfile = (c: Context<UserVariables>) => {
	const authUser = requireAuthUser(c);

	return c.json({
		success: true,
		data: toUserProfileDto(authUser),
	});
};

export const updateProfile = async (c: Context<UserVariables>) => {
	const authUser = requireAuthUser(c);
	const db = c.get("db");

	const body = await c.req.json<{
		name?: string;
		avatarUrl?: string;
	}>();

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
		throw new HTTPException(404, {
			message: "User not found",
		});
	}

	return c.json({
		success: true,
		message: "Profile updated successfully",
		data: toUserProfileDto(updatedUser[0]),
	});
};

export const getVipStatus = (c: Context<UserVariables>) => {
	const authUser = requireAuthUser(c);

	return c.json({
		success: true,
		data: toVipDto(authUser),
	});
};

import type { Context } from "hono";
import { desc } from "drizzle-orm";
import { getDb } from "../db/index.js";
import { getEnv } from "../core/env.js";
import { int } from "zod";
import { interviews } from "../db/schema.js";

export const getHomeInterviews = async (c: Context) => {
	const { DATABASE_URL } = getEnv(c);

	const db = getDb(DATABASE_URL);

	const interviews = await db.query.interviews.findMany({
		orderBy: {
			createdAt: [desc(interviews.createdAt)],
		},
		take: 10,
	});

	return c.json({ interviews });
};

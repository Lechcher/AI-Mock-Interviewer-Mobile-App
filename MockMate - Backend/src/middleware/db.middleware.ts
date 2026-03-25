import { createMiddleware } from "hono/factory";
import { getEnv } from "../core/env.js";
import { getDb } from "../db/index.js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "../db/schema.js";

export const dbMiddleware = createMiddleware(async (c, next) => {
	const { DATABASE_URL } = getEnv(c);

	const db = getDb(DATABASE_URL) as PostgresJsDatabase<typeof schema>;

	c.set("db", db);

	await next();
});

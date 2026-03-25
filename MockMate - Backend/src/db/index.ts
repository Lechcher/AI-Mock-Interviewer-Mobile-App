import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

let queryClient: postgres.Sql | null = null;
let dbInstance: PostgresJsDatabase<typeof schema> | null = null;

export const getDb = (
	databaseUrl: string,
): PostgresJsDatabase<typeof schema> => {
	if (!databaseUrl) {
		throw new Error(
			"DATABASE_URL is missing. Please set it in your environment variables.",
		);
	}

	if (dbInstance) {
		return dbInstance;
	}

	// Initialize Postgres client with drizzle-orm
	// prepare: false is used to disable prepared statements, which can cause issues in serverless environments like Cloudflare Workers.
	queryClient = postgres(databaseUrl, { prepare: false });
	dbInstance = drizzle(queryClient, { schema });

	return dbInstance;
};

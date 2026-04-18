import type { Context } from "hono";
import { env } from "hono/adapter";
import z from "zod";

// URL regex pattern for validating URLs (replaces deprecated .url() method)
// const URL_REGEX =
// 	/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/;

export const envShema = z.object({
	BITWARDEN_ACCESS_TOKEN: z.string().optional(),
	DATABASE_URL: z.string().min(1),
	REVENUECAT_API_KEY: z.string().min(1),
	APPWRITE_ENDPOINT: z.string().min(1),
	APPWRITE_PROJECT_ID: z.string().min(1),
	REVENUECAT_WEBHOOK_SECRET: z.string().min(1),
	AI_API_KEY: z.string().min(1),
	AI_BASE_URL: z.string().min(1),
	PORT: z.coerce.number().default(3000),
});

export type EnvConfig = z.infer<typeof envShema>;

export const getEnv = (c: Context): EnvConfig => {
	const rawEnv = env(c);

	const parsedEnv = envShema.safeParse(rawEnv);

	if (!parsedEnv.success) {
		throw new Error(
			`Invalid environment variables: ${parsedEnv.error.message}`,
		);
	}

	return parsedEnv.data;
};

import * as schema from "../db/schema.js";
import { createMiddleware } from "hono/factory";
import { getEnv } from "../core/env.js";
import { Account, Client, type Models } from "node-appwrite";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { getDb } from "../db/index.js";

type AuthVariables = {
	Variables: {
		user: typeof schema.users.$inferSelect;
	};
};

export const authMiddleware = createMiddleware<AuthVariables>(
	async (c, next) => {
		const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, DATABASE_URL } = getEnv(c);

		const db = getDb(DATABASE_URL);

		const authHeader = c.req.header("Authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return c.json({ error: "Unauthorized" }, 401);
		}

		const jwt = authHeader.split(" ")[1];

		const client = new Client()
			.setEndpoint(APPWRITE_ENDPOINT)
			.setProject(APPWRITE_PROJECT_ID)
			.setJWT(jwt);

		const account = new Account(client);

		let appwriteUser: Models.User<Models.Preferences>;

		try {
			appwriteUser = await account.get();
		} catch (error) {
			throw new HTTPException(401, { message: `Invalid token: ${error}` });
		}

		// Look up the user in the database by their Appwrite ID
		const dbUser = await db.query.users.findFirst({
			where: eq(schema.users.appwriteId, appwriteUser.$id),
		});

		if (!dbUser) {
			const [newUser] = await db
				.insert(schema.users)
				.values({
					appwriteId: appwriteUser.$id,
					email: appwriteUser.email,
					name: appwriteUser.name,
				})
				.returning();

			c.set("user", newUser);

			await next();
			return;
		}

		c.set("user", dbUser);

		await next();
	},
);

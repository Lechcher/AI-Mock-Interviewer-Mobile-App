import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { getDb } from "../db/index.js";
import { getEnv } from "../core/env.js";
import { users } from "../db/schema.js";
export const webhooksRoutes = new Hono();

webhooksRoutes.post("/revenuecat", async (c) => {
	const { REVENUECAT_WEBHOOK_SECRET, DATABASE_URL } = getEnv(c);

	const authHeader = c.req.header("Authorization");
	if (!authHeader || authHeader !== `Bearer ${REVENUECAT_WEBHOOK_SECRET}`) {
		return c.json({ success: false, error: "Unauthorized" }, 401);
	}

	const body = await c.req.json();
	const event = body.event;

	const userId = event.app_user_id;
	if (!userId) {
		return c.json({ success: false, error: "Missing user ID" }, 400);
	}

	const db = getDb(DATABASE_URL);

	try {
		if (event.type === "INITIAL_PURCHASE" || event.type === "RENEWAL") {
			const plan = event.product_id.includes("yearly") ? "yearly" : "monthly";
			const billingDate = event.expiration_at_ms
				? new Date(event.expiration_at_ms)
				: null;

			await db
				.update(users)
				.set({
					isVip: true,
					vipPlan: plan,
					...(billingDate && { vipNextBillingDate: billingDate }),
				})
				.where(eq(users.id, userId));
		} else if (event.type === "CANCELLATION" || event.type === "EXPIRATION") {
			await db.update(users).set({ isVip: false }).where(eq(users.id, userId));
		}

		return c.json({ success: true }, 200);
	} catch (error) {
		console.error("Error updating user:", { userId, error });
		return c.json({ success: false, error: "Internal Server Error" }, 500);
	}
});

import type { Context, Next } from "hono";

import { HTTPException } from "hono/http-exception";

export const vipMiddleware = async (c: Context, next: Next) => {
	const user = c.get("user");

	if (!user || !user.isVip) {
		throw new HTTPException(403, {
			message: "Access denied. VIP membership required.",
		});
	}

	await next();
};

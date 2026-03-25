import type { Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export const registerErrorMiddleware = (app: Hono) => {
	app.notFound((c: Context) => {
		return c.json({ success: false, error: "Not Found" }, 404);
	});

	app.onError((err: Error, c: Context) => {
		console.error(`[Global Error] ${c.req.method} ${c.req.url} -`, err);

		if (err instanceof HTTPException) {
			return c.json({ success: false, error: err.message }, err.status);
		}

		if (typeof err === "object" && err !== null && "code" in err) {
			const dbError = err as { code: string; detail?: string };
			if (dbError.code === "23505") {
				return c.json(
					{ success: false, error: "Duplicate entry", detail: dbError.detail },
					409,
				);
			}
		}

		if (err instanceof Error && err.message.includes("Invalid JWT")) {
			return c.json({ success: false, error: "Invalid token" }, 401);
		}

		if (err instanceof Error && err.message.includes("Token expired")) {
			return c.json({ success: false, error: "Token expired" }, 401);
		}

		if (err.name === "ZodError") {
			return c.json(
				{
					success: false,
					error: "Validation error",
					details: JSON.parse(err.message),
				},
				400,
			);
		}

		return c.json(
			{
				success: false,
				error: "Internal Server Error",
				message:
					process.env.NODE_ENV === "development" ? err.message : undefined,
			},
			500,
		);
	});
};

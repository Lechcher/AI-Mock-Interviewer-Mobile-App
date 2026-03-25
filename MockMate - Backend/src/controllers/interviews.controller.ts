import { Hono } from "hono";

export const interviewsRoutes = new Hono();

interviewsRoutes.get("/features", (c) => {
	return c.json({});
});

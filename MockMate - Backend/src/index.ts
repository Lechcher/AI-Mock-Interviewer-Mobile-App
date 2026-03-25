import { Hono } from "hono";
import { getEnv } from "./core/env.js";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { interviewsRoutes } from "./routes/interviews.route.js";
import { usersRoutes } from "./routes/users.route.js";
import { sessionsRoutes } from "./routes/sessions.route.js";
import { questsRoutes } from "./routes/quests.route.js";
import { shopRoutes } from "./routes/shop.route.js";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
	const { PORT } = getEnv(c);
	const currentPort = PORT || 3000;

	return c.text(
		`MockMate AI Backend is running at localhost:${currentPort} 🚀`,
	);
});

app.route("/api/v1/interviews", interviewsRoutes);
app.route("/api/v1/users", usersRoutes);
app.route("/api/v1/sessions", sessionsRoutes);
app.route("/api/v1/quests", questsRoutes);
app.route("/api/v1/shop", shopRoutes);

export default {
	port: process.env?.PORT || 3000,
	fetch: app.fetch,
};

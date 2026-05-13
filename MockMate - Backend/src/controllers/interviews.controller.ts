import {desc, eq} from "drizzle-orm";

import type {Context} from "hono";
import OpenAI from "openai";
import {getDb} from "../db/index.js";
import {getEnv} from "../core/env.js";
import {interviews} from "../db/schema.js";

export const getHomeInterviews = async (c: Context) => {
    const {DATABASE_URL} = getEnv(c);

    const db = getDb(DATABASE_URL);

    const featuredInterviews = await db.query.interviews.findMany({
        orderBy: [desc(interviews.avgRating)],
        limit: 6,
    });

    const latestInterviews = await db.query.interviews.findMany({
        orderBy: [desc(interviews.createdAt)],
        limit: 10,
    });

    return c.json({
        suscess: true,
        data: {
            featuredInterviews,
            latestInterviews,
        },
    });
};

export const getExploreInterviews = async (c: Context) => {
    const {DATABASE_URL} = getEnv(c);

    const db = getDb(DATABASE_URL);

    const page = Number(c.req.query("page")) || 1;
    const limit = Number(c.req.query("limit")) || 10;
    const industry = c.req.query("industry");

    const offset = (page - 1) * limit;

    const conditions =
        industry && industry !== "All"
            ? eq(interviews.focusArea, industry)
            : undefined;

    const data = await db.query.interviews.findMany({
        where: conditions,
        limit,
        offset,
    });

    return c.json({
        success: true,
        data,
        meta: {
            page,
            limit,
            hasNextPage: data.length === limit,
        },
    });
};

export const createCustomInterview = async (c: Context) => {
    const {DATABASE_URL, AI_API_KEY, AI_BASE_URL} = getEnv(c);

    const db = getDb(DATABASE_URL);
    const openai = new OpenAI({
        apiKey: AI_API_KEY,
        baseURL: AI_BASE_URL,
    });

    const user = c.get("user");
    const body = await c.req.json();

    const prompt = `
    You are a senior recruitment expert. The candidate has requested to generate an interview with the following details:
    - Position: ${body.title}
    - Industry: ${body.industry}
    - Focus Area: ${body.focusArea}
    - Difficulty: ${body.difficulty}
    - Scope: ${body.questionCount} questions
    
    Please refine the 'title' to make it more professional, and rewrite the 'focusArea' into a concise, sharp paragraph that accurately describes exactly what the AI will evaluate within these exact ${body.questionCount} questions.
    Return the response in JSON format: { "refinedTitle": "...", "refinedFocusArea": "..." }
`;

    try {
        const aiResponse = await openai.chat.completions.create({
            model: "openrouter/openrouter/free",
            messages: [{role: "user", content: prompt}],
            response_format: {
                type: "json_object",
            },
        });

        const aiData = JSON.parse(aiResponse.choices[0].message.content || "{}");

        const [newInterview] = await db
            .insert(interviews)
            .values({
                title: aiData.refinedTitle,
                industry: body.industry,
                difficulty: body.difficulty,
                questionCount: body.questionCount,
                focusArea: aiData.refinedFocusArea,
                createdBy: user.id,
            })
            .returning();

        return c.json({
            success: true,
            data: newInterview,
        });
    } catch (error) {
        console.error("Error creating custom interview:", error);

        return c.json({
            success: false,
            error: "Failed to create custom interview",
        });
    }
};

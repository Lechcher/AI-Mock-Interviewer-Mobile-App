import { relations, sql } from "drizzle-orm";
import {
	pgTable,
	uuid,
	varchar,
	integer,
	timestamp,
	boolean,
	date,
	doublePrecision,
	uniqueIndex,
	index,
	primaryKey,
	check,
} from "drizzle-orm/pg-core";

// ==========================================
// ENUMS
// ==========================================
export const interviewDifficultyEnum = ["easy", "medium", "hard"] as const;
export type InterviewDifficulty = (typeof interviewDifficultyEnum)[number];

export const sessionModeEnum = ["text", "voice"] as const;
export type SessionMode = (typeof sessionModeEnum)[number];

export const sessionStatusEnum = [
	"in_progress",
	"completed",
	"stopped",
] as const;
export type SessionStatus = (typeof sessionStatusEnum)[number];

export const questTypeEnum = [
	"complete_interview",
	"learn_minutes",
	"earn_exp",
	"earn_gems",
] as const;
export type QuestType = (typeof questTypeEnum)[number];

// ==========================================
// 1. USERS TABLE
// ==========================================
export const users = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		appwriteId: varchar("appwrite_id").notNull().unique(),
		name: varchar("name", { length: 255 }).notNull(),
		email: varchar("email", { length: 255 }).notNull().unique(),
		avatarUrl: varchar("avatar_url", { length: 255 }),
		gems: integer("gems").notNull().default(0),
		totalXp: integer("total_xp").notNull().default(0),
		currentStreak: integer("current_streak").notNull().default(0),
		streakFreeze: integer("streak_freeze").notNull().default(0),
		lastLearnDate: date("last_learn_date"),
		doubleXpExpiresAt: timestamp("double_xp_expires_at"),
		isVip: boolean("is_vip").notNull().default(false),
		vipPlan: varchar("vip_plan"),
		vipNextBillingDate: timestamp("vip_next_billing_date"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [
		// Ensure gems, totalXp, currentStreak, streakFreeze are non-negative
		check("users_gems_check", sql`${table.gems} >= 0`),
		check("users_total_xp_check", sql`${table.totalXp} >= 0`),
		check("users_current_streak_check", sql`${table.currentStreak} >= 0`),
		check("users_streak_freeze_check", sql`${table.streakFreeze} >= 0`),
	],
);

export const usersRelations = relations(users, ({ many }) => ({
	interviews: many(interviews),
	reviews: many(interviewReviews),
	savedInterviews: many(savedInterviews),
	session: many(interviewSessions),
	userQuests: many(userQuests),
}));

// ==========================================
// 2. INTERVIEWS TABLE
// ==========================================
export const interviews = pgTable(
	"interviews",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: varchar("title", { length: 255 }).notNull(),
		industry: varchar("industry", { length: 255 }).notNull(),
		difficulty: varchar("difficulty", { length: 50 }).notNull(),
		questionCount: integer("question_count").notNull(),
		focusArea: varchar("focus_area", { length: 255 }).notNull(),
		createdBy: uuid("created_by")
			.notNull()
			.references(() => users.id),
		avgRating: doublePrecision("avg_rating").notNull().default(0),
		totalReviews: integer("total_reviews").notNull().default(0),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at"),
	},
	(table) => [
		// Index for faster lookups by creator
		index("interviews_created_by_idx").on(table.createdBy),
		// Check constraints
		check("interviews_question_count_check", sql`${table.questionCount} > 0`),
		check(
			"interviews_avg_rating_check",
			sql`${table.avgRating} >= 0 AND ${table.avgRating} <= 5`,
		),
		check("interviews_total_reviews_check", sql`${table.totalReviews} >= 0`),
	],
);

export const interviewsRelations = relations(interviews, ({ one }) => ({
	user: one(users, { fields: [interviews.createdBy], references: [users.id] }),
}));

// ==========================================
// 3. INTERVIEW REVIEWS TABLE
// ==========================================
export const interviewReviews = pgTable(
	"interview_reviews",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		interviewId: uuid("interview_id")
			.references(() => interviews.id, { onDelete: "cascade" })
			.notNull(),
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		rating: integer("rating").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		// Unique constraint to prevent duplicate reviews
		uniqueIndex("unq_user_review_idx").on(table.interviewId, table.userId),
		// Indexes for better query performance
		index("interview_reviews_interview_id_idx").on(table.interviewId),
		index("interview_reviews_user_id_idx").on(table.userId),
		// Check constraint for rating (1-5 scale)
		check(
			"interview_reviews_rating_check",
			sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
		),
	],
);

export const interviewReviewsRelations = relations(
	interviewReviews,
	({ one }) => ({
		user: one(users, {
			fields: [interviewReviews.userId],
			references: [users.id],
		}),
		interview: one(interviews, {
			fields: [interviewReviews.interviewId],
			references: [interviews.id],
		}),
	}),
);

// ==========================================
// 4. SAVED INTERVIEWS TABLE
// ==========================================
export const savedInterviews = pgTable(
	"saved_interviews",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		interviewId: uuid("interview_id")
			.notNull()
			.references(() => interviews.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		primaryKey({
			columns: [table.userId, table.interviewId],
			name: "unqUserInterviewIdx",
		}),
		// Additional indexes for query performance
		index("saved_interviews_user_id_idx").on(table.userId),
		index("saved_interviews_interview_id_idx").on(table.interviewId),
	],
);

export const savedInterviewsRelations = relations(
	savedInterviews,
	({ one }) => ({
		user: one(users, {
			fields: [savedInterviews.userId],
			references: [users.id],
		}),
		interview: one(interviews, {
			fields: [savedInterviews.interviewId],
			references: [interviews.id],
		}),
	}),
);

// ==========================================
// 5. INTERVIEW SESSIONS TABLE
// ==========================================
export const interviewSessions = pgTable(
	"interview_sessions",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		interviewId: uuid("interview_id")
			.references(() => interviews.id, { onDelete: "cascade" })
			.notNull(),
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		mode: varchar("mode", { length: 20 }).notNull(),
		status: varchar("status", { length: 20 }).notNull().default("in_progress"),
		xpEarned: integer("xp_earned").notNull().default(0),
		startedAt: timestamp("started_at").notNull().defaultNow(),
		endedAt: timestamp("ended_at"),
	},
	(table) => [
		// Indexes for query performance
		index("interview_sessions_interview_id_idx").on(table.interviewId),
		index("interview_sessions_user_id_idx").on(table.userId),
		index("interview_sessions_status_idx").on(table.status),
		// Check constraints
		check("interview_sessions_xp_earned_check", sql`${table.xpEarned} >= 0`),
	],
);

export const interviewSessionsRelations = relations(
	interviewSessions,
	({ one }) => ({
		user: one(users, {
			fields: [interviewSessions.userId],
			references: [users.id],
		}),
		interview: one(interviews, {
			fields: [interviewSessions.interviewId],
			references: [interviews.id],
		}),
	}),
);

// ==========================================
// ==========================================
// 6. DAILY QUESTS TABLE
// ==========================================
export const dailyQuests = pgTable(
	"daily_quests",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		questType: varchar("quest_type", { length: 50 }).notNull(),
		title: varchar("title").notNull(),
		requirements: integer("requirements").notNull(),
		rewardGems: integer("reward_gems").notNull(),
		activeDate: date("active_date").notNull(),
	},
	(table) => [
		// Index for querying quests by date
		index("daily_quests_active_date_idx").on(table.activeDate),
		// Check constraints
		check("daily_quests_requirements_check", sql`${table.requirements} > 0`),
		check("daily_quests_reward_gems_check", sql`${table.rewardGems} > 0`),
	],
);

export const dailyQuestsRelations = relations(dailyQuests, ({ many }) => ({
	userProgress: many(userQuests),
}));

// ==========================================
// ==========================================
// 7. USER QUESTS TABLE
// ==========================================
export const userQuests = pgTable(
	"user_quests",
	{
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		questId: uuid("quest_id")
			.references(() => dailyQuests.id, { onDelete: "cascade" })
			.notNull(),
		progress: integer("progress").notNull().default(0),
		isClaimed: boolean("is_claimed").notNull().default(false),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [
		primaryKey({ columns: [table.userId, table.questId] }),
		// Additional indexes for query performance
		index("user_quests_user_id_idx").on(table.userId),
		index("user_quests_quest_id_idx").on(table.questId),
		// Check constraint for non-negative progress
		check("user_quests_progress_check", sql`${table.progress} >= 0`),
	],
);

export const userQuestsRelations = relations(userQuests, ({ one }) => ({
	user: one(users, {
		fields: [userQuests.userId],
		references: [users.id],
	}),
	quest: one(dailyQuests, {
		fields: [userQuests.questId],
		references: [dailyQuests.id],
	}),
}));

import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

// Import all tables from schema
import {
	users,
	interviews,
	interviewReviews,
	savedInterviews,
	interviewSessions,
	dailyQuests,
	userQuests,
	// Enum types
	interviewDifficultyEnum,
	sessionModeEnum,
	sessionStatusEnum,
	questTypeEnum,
} from "./schema.js";

// ==========================================
// USERS VALIDATORS
// ==========================================

// Base insert schema for users
const baseInsertUserSchema = createInsertSchema(users);

// Schema for creating a new user with custom validations
export const insertUserSchema = baseInsertUserSchema.extend({
	email: z.string().email("Invalid email address"),
	avatarUrl: z.string().url().optional().nullable(),
	name: z.string().min(1, "Name is required"),
	gems: z.number().int().min(0, "Gems cannot be negative"),
	totalXp: z.number().int().min(0, "Total XP cannot be negative"),
	currentStreak: z.number().int().min(0, "Current streak cannot be negative"),
	streakFreeze: z.number().int().min(0, "Streak freeze cannot be negative"),
});

// Schema for updating a user
export const updateUserSchema = createUpdateSchema(users).extend({
	email: z.string().email("Invalid email address").optional(),
	avatarUrl: z.string().url().optional().nullable(),
	name: z.string().min(1, "Name is required").optional(),
	gems: z.number().int().min(0, "Gems cannot be negative").optional(),
	totalXp: z.number().int().min(0, "Total XP cannot be negative").optional(),
	currentStreak: z
		.number()
		.int()
		.min(0, "Current streak cannot be negative")
		.optional(),
	streakFreeze: z
		.number()
		.int()
		.min(0, "Streak freeze cannot be negative")
		.optional(),
});

// Type exports for users
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect;

// ==========================================
// INTERVIEWS VALIDATORS
// ==========================================

// Schema for creating a new interview
export const insertInterviewSchema = createInsertSchema(interviews).extend({
	title: z.string().min(1, "Title is required"),
	industry: z.string().min(1, "Industry is required"),
	difficulty: z.enum(interviewDifficultyEnum),
	questionCount: z.number().int().min(1, "Question count must be at least 1"),
	focusArea: z.string().min(1, "Focus area is required"),
	avgRating: z
		.number()
		.min(0, "Rating cannot be negative")
		.max(5, "Rating cannot exceed 5"),
	totalReviews: z.number().int().min(0, "Total reviews cannot be negative"),
});

// Schema for updating an interview
export const updateInterviewSchema = createUpdateSchema(interviews).extend({
	title: z.string().min(1, "Title is required").optional(),
	industry: z.string().min(1, "Industry is required").optional(),
	difficulty: z.enum(interviewDifficultyEnum).optional(),
	questionCount: z
		.number()
		.int()
		.min(1, "Question count must be at least 1")
		.optional(),
	focusArea: z.string().min(1, "Focus area is required").optional(),
	avgRating: z
		.number()
		.min(0, "Rating cannot be negative")
		.max(5, "Rating cannot exceed 5")
		.optional(),
	totalReviews: z
		.number()
		.int()
		.min(0, "Total reviews cannot be negative")
		.optional(),
});

// Type exports for interviews
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type UpdateInterview = z.infer<typeof updateInterviewSchema>;
export type Interview = typeof interviews.$inferSelect;

// ==========================================
// INTERVIEW REVIEWS VALIDATORS
// ==========================================

// Schema for creating a new review
export const insertInterviewReviewSchema = createInsertSchema(
	interviewReviews,
).extend({
	rating: z
		.number()
		.int()
		.min(1, "Rating must be at least 1")
		.max(5, "Rating cannot exceed 5"),
});

// Schema for updating a review
export const updateInterviewReviewSchema = createUpdateSchema(
	interviewReviews,
).extend({
	rating: z
		.number()
		.int()
		.min(1, "Rating must be at least 1")
		.max(5, "Rating cannot exceed 5")
		.optional(),
});

// Type exports for reviews
export type InsertInterviewReview = z.infer<typeof insertInterviewReviewSchema>;
export type UpdateInterviewReview = z.infer<typeof updateInterviewReviewSchema>;
export type InterviewReview = typeof interviewReviews.$inferSelect;

// ==========================================
// SAVED INTERVIEWS VALIDATORS
// ==========================================

// Schema for saving an interview
export const insertSavedInterviewSchema = createInsertSchema(savedInterviews);

// Schema for updating saved interview (rarely needed)
export const updateSavedInterviewSchema = createUpdateSchema(savedInterviews);

// Type exports for saved interviews
export type InsertSavedInterview = z.infer<typeof insertSavedInterviewSchema>;
export type UpdateSavedInterview = z.infer<typeof updateSavedInterviewSchema>;
export type SavedInterview = typeof savedInterviews.$inferSelect;

// ==========================================
// INTERVIEW SESSIONS VALIDATORS
// ==========================================

// Schema for creating a new session
export const insertInterviewSessionSchema = createInsertSchema(
	interviewSessions,
).extend({
	mode: z.enum(sessionModeEnum),
	status: z.enum(sessionStatusEnum).default("in_progress"),
	xpEarned: z.number().int().min(0, "XP earned cannot be negative"),
});

// Schema for updating a session
export const updateInterviewSessionSchema = createUpdateSchema(
	interviewSessions,
).extend({
	mode: z.enum(sessionModeEnum).optional(),
	status: z.enum(sessionStatusEnum).optional(),
	xpEarned: z.number().int().min(0, "XP earned cannot be negative").optional(),
});

// Type exports for sessions
export type InsertInterviewSession = z.infer<
	typeof insertInterviewSessionSchema
>;
export type UpdateInterviewSession = z.infer<
	typeof updateInterviewSessionSchema
>;
export type InterviewSession = typeof interviewSessions.$inferSelect;

// ==========================================
// DAILY QUESTS VALIDATORS
// ==========================================

// Schema for creating a new quest
export const insertDailyQuestSchema = createInsertSchema(dailyQuests).extend({
	questType: z.enum(questTypeEnum),
	title: z.string().min(1, "Title is required"),
	requirements: z.number().int().min(1, "Requirements must be at least 1"),
	rewardGems: z.number().int().min(1, "Reward gems must be at least 1"),
});

// Schema for updating a quest
export const updateDailyQuestSchema = createUpdateSchema(dailyQuests).extend({
	questType: z.enum(questTypeEnum).optional(),
	title: z.string().min(1, "Title is required").optional(),
	requirements: z
		.number()
		.int()
		.min(1, "Requirements must be at least 1")
		.optional(),
	rewardGems: z
		.number()
		.int()
		.min(1, "Reward gems must be at least 1")
		.optional(),
});

// Type exports for quests
export type InsertDailyQuest = z.infer<typeof insertDailyQuestSchema>;
export type UpdateDailyQuest = z.infer<typeof updateDailyQuestSchema>;
export type DailyQuest = typeof dailyQuests.$inferSelect;

// ==========================================
// USER QUESTS VALIDATORS
// ==========================================

// Schema for creating user quest progress
export const insertUserQuestSchema = createInsertSchema(userQuests).extend({
	progress: z.number().int().min(0, "Progress cannot be negative"),
});

// Schema for updating user quest progress
export const updateUserQuestSchema = createUpdateSchema(userQuests).extend({
	progress: z.number().int().min(0, "Progress cannot be negative").optional(),
});

// Type exports for user quests
export type InsertUserQuest = z.infer<typeof insertUserQuestSchema>;
export type UpdateUserQuest = z.infer<typeof updateUserQuestSchema>;
export type UserQuest = typeof userQuests.$inferSelect;

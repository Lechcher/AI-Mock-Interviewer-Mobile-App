CREATE TYPE "public"."interview_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."quest_type" AS ENUM('complete_interview', 'learn_minutes', 'earn_exp', 'earn_gems');--> statement-breakpoint
CREATE TYPE "public"."session_mode" AS ENUM('text', 'voice');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('in_progress', 'completed', 'stopped');--> statement-breakpoint
ALTER TABLE "daily_quests" ALTER COLUMN "quest_type" SET DATA TYPE "public"."quest_type" USING "quest_type"::"public"."quest_type";--> statement-breakpoint
ALTER TABLE "interview_sessions" ALTER COLUMN "mode" SET DATA TYPE "public"."session_mode" USING "mode"::"public"."session_mode";--> statement-breakpoint
ALTER TABLE "interview_sessions" ALTER COLUMN "status" SET DEFAULT 'in_progress'::"public"."session_status";--> statement-breakpoint
ALTER TABLE "interview_sessions" ALTER COLUMN "status" SET DATA TYPE "public"."session_status" USING "status"::"public"."session_status";--> statement-breakpoint
ALTER TABLE "interviews" ALTER COLUMN "difficulty" SET DATA TYPE "public"."interview_difficulty" USING "difficulty"::"public"."interview_difficulty";--> statement-breakpoint
ALTER TABLE "interviews" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "interviews" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "interviews" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "interviews" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "interviews" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "double_xp_expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "vip_plan" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "vip_next_billing_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "interviews_learned_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_interviews_learned_count_check" CHECK ("users"."interviews_learned_count" >= 0);
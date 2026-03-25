CREATE TABLE "daily_quests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quest_type" varchar(50) NOT NULL,
	"title" varchar NOT NULL,
	"requirements" integer NOT NULL,
	"reward_gems" integer NOT NULL,
	"active_date" date NOT NULL,
	CONSTRAINT "daily_quests_requirements_check" CHECK ("daily_quests"."requirements" > 0),
	CONSTRAINT "daily_quests_reward_gems_check" CHECK ("daily_quests"."reward_gems" > 0)
);
--> statement-breakpoint
CREATE TABLE "interview_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interview_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "interview_reviews_rating_check" CHECK ("interview_reviews"."rating" >= 1 AND "interview_reviews"."rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "interview_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interview_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"mode" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'in_progress' NOT NULL,
	"xp_earned" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"ended_at" timestamp,
	CONSTRAINT "interview_sessions_xp_earned_check" CHECK ("interview_sessions"."xp_earned" >= 0)
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"industry" varchar(255) NOT NULL,
	"difficulty" varchar(50) NOT NULL,
	"question_count" integer NOT NULL,
	"focus_area" varchar(255) NOT NULL,
	"created_by" uuid NOT NULL,
	"avg_rating" double precision DEFAULT 0 NOT NULL,
	"total_reviews" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "interviews_question_count_check" CHECK ("interviews"."question_count" > 0),
	CONSTRAINT "interviews_avg_rating_check" CHECK ("interviews"."avg_rating" >= 0 AND "interviews"."avg_rating" <= 5),
	CONSTRAINT "interviews_total_reviews_check" CHECK ("interviews"."total_reviews" >= 0)
);
--> statement-breakpoint
CREATE TABLE "saved_interviews" (
	"user_id" uuid NOT NULL,
	"interview_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unqUserInterviewIdx" PRIMARY KEY("user_id","interview_id")
);
--> statement-breakpoint
CREATE TABLE "user_quests" (
	"user_id" uuid NOT NULL,
	"quest_id" uuid NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"is_claimed" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_quests_user_id_quest_id_pk" PRIMARY KEY("user_id","quest_id"),
	CONSTRAINT "user_quests_progress_check" CHECK ("user_quests"."progress" >= 0)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"appwrite_id" varchar NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"avatar_url" varchar(255),
	"gems" integer DEFAULT 0 NOT NULL,
	"total_xp" integer DEFAULT 0 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"streak_freeze" integer DEFAULT 0 NOT NULL,
	"last_learn_date" date,
	"double_xp_expires_at" timestamp,
	"is_vip" boolean DEFAULT false NOT NULL,
	"vip_plan" varchar,
	"vip_next_billing_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_appwrite_id_unique" UNIQUE("appwrite_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_gems_check" CHECK ("users"."gems" >= 0),
	CONSTRAINT "users_total_xp_check" CHECK ("users"."total_xp" >= 0),
	CONSTRAINT "users_current_streak_check" CHECK ("users"."current_streak" >= 0),
	CONSTRAINT "users_streak_freeze_check" CHECK ("users"."streak_freeze" >= 0)
);
--> statement-breakpoint
ALTER TABLE "interview_reviews" ADD CONSTRAINT "interview_reviews_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_reviews" ADD CONSTRAINT "interview_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview_sessions" ADD CONSTRAINT "interview_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_interviews" ADD CONSTRAINT "saved_interviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_interviews" ADD CONSTRAINT "saved_interviews_interview_id_interviews_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interviews"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quests" ADD CONSTRAINT "user_quests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_quests" ADD CONSTRAINT "user_quests_quest_id_daily_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."daily_quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "daily_quests_active_date_idx" ON "daily_quests" USING btree ("active_date");--> statement-breakpoint
CREATE UNIQUE INDEX "unq_user_review_idx" ON "interview_reviews" USING btree ("interview_id","user_id");--> statement-breakpoint
CREATE INDEX "interview_reviews_interview_id_idx" ON "interview_reviews" USING btree ("interview_id");--> statement-breakpoint
CREATE INDEX "interview_reviews_user_id_idx" ON "interview_reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "interview_sessions_interview_id_idx" ON "interview_sessions" USING btree ("interview_id");--> statement-breakpoint
CREATE INDEX "interview_sessions_user_id_idx" ON "interview_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "interview_sessions_status_idx" ON "interview_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "interviews_created_by_idx" ON "interviews" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "saved_interviews_user_id_idx" ON "saved_interviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saved_interviews_interview_id_idx" ON "saved_interviews" USING btree ("interview_id");--> statement-breakpoint
CREATE INDEX "user_quests_user_id_idx" ON "user_quests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_quests_quest_id_idx" ON "user_quests" USING btree ("quest_id");
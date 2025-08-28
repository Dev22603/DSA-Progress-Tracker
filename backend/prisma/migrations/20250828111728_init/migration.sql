-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sheets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "has_sub_steps" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."questions" (
    "id" SERIAL NOT NULL,
    "problem_id" TEXT NOT NULL,
    "problem_name" TEXT NOT NULL,
    "company_tags" JSONB,
    "leetcode_link" TEXT,
    "gfg_link" TEXT,
    "code360_link" TEXT,
    "tuf_article" TEXT,
    "tuf_yt_video_link" TEXT,
    "tuf_link" TEXT,
    "difficulty" DOUBLE PRECISION,
    "leetcode_description" TEXT,
    "leetcode_premium_question" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sheet_questions" (
    "id" SERIAL NOT NULL,
    "sheet_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "step_number" INTEGER NOT NULL,
    "sub_step_number" INTEGER,
    "sr_no" INTEGER,
    "topic" TEXT,
    "sub_topic" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sheet_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_question_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "is_done" BOOLEAN NOT NULL DEFAULT false,
    "personal_note" TEXT,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_question_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "questions_problem_id_key" ON "public"."questions"("problem_id");

-- CreateIndex
CREATE UNIQUE INDEX "sheet_questions_sheet_id_question_id_key" ON "public"."sheet_questions"("sheet_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_question_progress_user_id_question_id_key" ON "public"."user_question_progress"("user_id", "question_id");

-- AddForeignKey
ALTER TABLE "public"."sheet_questions" ADD CONSTRAINT "sheet_questions_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "public"."sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sheet_questions" ADD CONSTRAINT "sheet_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_question_progress" ADD CONSTRAINT "user_question_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_question_progress" ADD CONSTRAINT "user_question_progress_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

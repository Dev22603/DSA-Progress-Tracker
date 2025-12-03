-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "problem_id" TEXT NOT NULL,
    "problem_name" TEXT NOT NULL,
    "company_tags" TEXT[],
    "leetcode_link" TEXT,
    "gfg_link" TEXT,
    "code360_link" TEXT,
    "tuf_article" TEXT,
    "tuf_yt_video_link" TEXT,
    "difficulty" INTEGER NOT NULL,
    "leetcode_premium_question" BOOLEAN NOT NULL DEFAULT false,
    "tuf_link" TEXT,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sheets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number_of_questions" INTEGER NOT NULL,
    "has_sub_steps" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sheet_questions" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "sheet_id" INTEGER NOT NULL,
    "step_number" INTEGER NOT NULL,
    "sub_step_number" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sheet_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "leetcode_done" BOOLEAN NOT NULL DEFAULT false,
    "gfg_done" BOOLEAN NOT NULL DEFAULT false,
    "code360_done" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "questions_problem_id_key" ON "questions"("problem_id");

-- CreateIndex
CREATE UNIQUE INDEX "sheet_questions_question_id_sheet_id_key" ON "sheet_questions"("question_id", "sheet_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_user_id_question_id_key" ON "user_progress"("user_id", "question_id");

-- AddForeignKey
ALTER TABLE "sheet_questions" ADD CONSTRAINT "sheet_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_questions" ADD CONSTRAINT "sheet_questions_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "sheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

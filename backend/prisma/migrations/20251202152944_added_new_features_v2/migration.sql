/*
  Warnings:

  - You are about to drop the column `created_at` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `leetcode_description` on the `questions` table. All the data in the column will be lost.
  - The `company_tags` column on the `questions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `difficulty` on the `questions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `created_at` on the `sheet_questions` table. All the data in the column will be lost.
  - You are about to drop the column `sr_no` on the `sheet_questions` table. All the data in the column will be lost.
  - You are about to drop the column `sub_topic` on the `sheet_questions` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `sheet_questions` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `sheets` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `user_question_progress` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[question_id,sheet_id]` on the table `sheet_questions` will be added. If there are existing duplicate values, this will fail.
  - Made the column `difficulty` on table `questions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `leetcode_premium_question` on table `questions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sub_step_number` on table `sheet_questions` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `number_of_questions` to the `sheets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "sheet_questions" DROP CONSTRAINT "sheet_questions_question_id_fkey";

-- DropForeignKey
ALTER TABLE "sheet_questions" DROP CONSTRAINT "sheet_questions_sheet_id_fkey";

-- DropForeignKey
ALTER TABLE "user_question_progress" DROP CONSTRAINT "user_question_progress_question_id_fkey";

-- DropForeignKey
ALTER TABLE "user_question_progress" DROP CONSTRAINT "user_question_progress_user_id_fkey";

-- DropIndex
DROP INDEX "sheet_questions_sheet_id_question_id_key";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "created_at",
DROP COLUMN "leetcode_description",
DROP COLUMN "company_tags",
ADD COLUMN     "company_tags" TEXT[],
ALTER COLUMN "difficulty" SET NOT NULL,
ALTER COLUMN "difficulty" SET DATA TYPE INTEGER,
ALTER COLUMN "leetcode_premium_question" SET NOT NULL,
ALTER COLUMN "leetcode_premium_question" SET DEFAULT false;

-- AlterTable
ALTER TABLE "sheet_questions" DROP COLUMN "created_at",
DROP COLUMN "sr_no",
DROP COLUMN "sub_topic",
DROP COLUMN "topic",
ALTER COLUMN "sub_step_number" SET NOT NULL,
ALTER COLUMN "sub_step_number" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "sheets" DROP COLUMN "created_at",
ADD COLUMN     "company_tags" TEXT[],
ADD COLUMN     "number_of_questions" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "user_question_progress";

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
CREATE UNIQUE INDEX "user_progress_user_id_question_id_key" ON "user_progress"("user_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "sheet_questions_question_id_sheet_id_key" ON "sheet_questions"("question_id", "sheet_id");

-- AddForeignKey
ALTER TABLE "sheet_questions" ADD CONSTRAINT "sheet_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sheet_questions" ADD CONSTRAINT "sheet_questions_sheet_id_fkey" FOREIGN KEY ("sheet_id") REFERENCES "sheets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[question_id,sheet_id,step_number,sub_step_number]` on the table `sheet_questions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "sheet_questions_question_id_sheet_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "sheet_questions_question_id_sheet_id_step_number_sub_step_n_key" ON "sheet_questions"("question_id", "sheet_id", "step_number", "sub_step_number");

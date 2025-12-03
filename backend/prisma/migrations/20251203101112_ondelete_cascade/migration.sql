-- DropForeignKey
ALTER TABLE "user_progress" DROP CONSTRAINT "user_progress_user_id_fkey";

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropIndex
DROP INDEX "public"."users_username_key";

-- AlterTable
ALTER TABLE "public"."users"
DROP COLUMN "username",
ADD COLUMN "first_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN "last_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';

-- Note: After running this migration, you may want to update any existing users
-- to have proper first_name and last_name values if there is existing data.

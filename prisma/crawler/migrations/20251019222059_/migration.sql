-- AlterTable
ALTER TABLE `publication_queue` ADD COLUMN `user_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `idx_pubq_user_id` ON `publication_queue`(`user_id`);

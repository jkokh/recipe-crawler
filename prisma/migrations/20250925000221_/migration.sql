/*
  Warnings:

  - You are about to drop the column `variants` on the `phrases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `phrases` DROP COLUMN `variants`,
    ADD COLUMN `json` JSON NULL,
    ADD COLUMN `source_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `phrases` ADD CONSTRAINT `phrases_source_id_fkey` FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

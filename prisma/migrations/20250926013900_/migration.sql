/*
  Warnings:

  - Made the column `source_id` on table `phrases` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `phrases` DROP FOREIGN KEY `phrases_source_id_fkey`;

-- AlterTable
ALTER TABLE `phrases` MODIFY `source_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `phrases` ADD CONSTRAINT `phrases_source_id_fkey` FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

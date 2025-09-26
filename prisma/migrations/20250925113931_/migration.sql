/*
  Warnings:

  - You are about to drop the column `hash` on the `phrases` table. All the data in the column will be lost.
  - Made the column `source_id` on table `phrases` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `phrases` DROP FOREIGN KEY `phrases_source_id_fkey`;

-- DropIndex
DROP INDEX `phrases_hash_key` ON `phrases`;

-- DropIndex
DROP INDEX `phrases_source_id_fkey` ON `phrases`;

-- AlterTable
ALTER TABLE `phrases` DROP COLUMN `hash`,
    MODIFY `source_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `phrases` ADD CONSTRAINT `phrases_source_id_fkey` FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[source_id,hash]` on the table `phrases` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `phrases` DROP FOREIGN KEY `phrases_source_id_fkey`;

-- DropIndex
DROP INDEX `phrases_source_id_fkey` ON `phrases`;

-- AlterTable
ALTER TABLE `phrases` ADD COLUMN `hash` VARCHAR(64) NOT NULL DEFAULT '',
    MODIFY `source_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `phrases_source_id_hash_key` ON `phrases`(`source_id`, `hash`);

-- AddForeignKey
ALTER TABLE `phrases` ADD CONSTRAINT `phrases_source_id_fkey` FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

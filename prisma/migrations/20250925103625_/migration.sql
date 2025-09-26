/*
  Warnings:

  - You are about to drop the column `variants` on the `phrases` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type,source_id,version]` on the table `phrases` will be added. If there are existing duplicate values, this will fail.
  - Made the column `type` on table `phrases` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `phrases_hash_idx` ON `phrases`;

-- AlterTable
ALTER TABLE `phrases` DROP COLUMN `variants`,
    ADD COLUMN `version` VARCHAR(32) NOT NULL DEFAULT 'default',
    MODIFY `type` VARCHAR(32) NOT NULL DEFAULT 'default';

-- CreateIndex
CREATE UNIQUE INDEX `phrases_type_source_id_version_key` ON `phrases`(`type`, `source_id`, `version`);

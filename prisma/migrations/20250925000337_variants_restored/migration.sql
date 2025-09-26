/*
  Warnings:

  - You are about to drop the column `json` on the `phrases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `phrases` DROP COLUMN `json`,
    ADD COLUMN `variants` JSON NULL;

/*
  Warnings:

  - You are about to drop the column `batch_id` on the `sources` table. All the data in the column will be lost.
  - You are about to drop the column `json` on the `sources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sources` DROP COLUMN `batch_id`,
    DROP COLUMN `json`;

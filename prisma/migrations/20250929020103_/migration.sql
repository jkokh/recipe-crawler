/*
  Warnings:

  - You are about to drop the column `json_history` on the `sources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sources` DROP COLUMN `json_history`;

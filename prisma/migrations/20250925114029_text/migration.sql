/*
  Warnings:

  - Made the column `text` on table `phrases` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `phrases` MODIFY `text` LONGTEXT NOT NULL;

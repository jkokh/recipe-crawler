/*
  Warnings:

  - You are about to drop the column `valid` on the `recipe_images` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `recipe_images` DROP COLUMN `valid`,
    ADD COLUMN `main` BOOLEAN NOT NULL DEFAULT false;

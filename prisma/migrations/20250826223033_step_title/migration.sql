/*
  Warnings:

  - Added the required column `title` to the `recipe_step` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `recipe_step` ADD COLUMN `title` VARCHAR(255) NOT NULL;

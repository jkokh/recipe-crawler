/*
  Warnings:

  - You are about to drop the column `recipe_id` on the `sources` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `sources` DROP FOREIGN KEY `recipe_urls_recipe_id_fkey`;

-- DropIndex
DROP INDEX `recipe_urls_recipe_id_key` ON `sources`;

-- AlterTable
ALTER TABLE `sources` DROP COLUMN `recipe_id`;

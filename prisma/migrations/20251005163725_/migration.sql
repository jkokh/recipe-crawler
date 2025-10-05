/*
  Warnings:

  - You are about to drop the `nutritions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_metas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_steps` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `nutritions` DROP FOREIGN KEY `nutritions_recipe_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_metas` DROP FOREIGN KEY `recipe_metas_recipe_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_steps` DROP FOREIGN KEY `recipe_steps_recipe_id_fkey`;

-- DropTable
DROP TABLE `nutritions`;

-- DropTable
DROP TABLE `recipe_metas`;

-- DropTable
DROP TABLE `recipe_steps`;

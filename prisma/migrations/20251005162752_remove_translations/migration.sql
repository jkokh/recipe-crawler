/*
  Warnings:

  - You are about to drop the `ingredient_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nutrition_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_ingredient_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_step_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tag_translations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ingredient_translations` DROP FOREIGN KEY `ingredient_translations_ingredient_id_fkey`;

-- DropForeignKey
ALTER TABLE `nutrition_translations` DROP FOREIGN KEY `nutrition_translations_nutrition_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_ingredient_translations` DROP FOREIGN KEY `recipe_ingredient_translations_recipe_ingredient_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_step_translations` DROP FOREIGN KEY `recipe_step_translations_recipe_step_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_translations` DROP FOREIGN KEY `recipe_translations_recipe_id_fkey`;

-- DropForeignKey
ALTER TABLE `tag_translations` DROP FOREIGN KEY `tag_translations_tag_id_fkey`;

-- DropTable
DROP TABLE `ingredient_translations`;

-- DropTable
DROP TABLE `nutrition_translations`;

-- DropTable
DROP TABLE `recipe_ingredient_translations`;

-- DropTable
DROP TABLE `recipe_step_translations`;

-- DropTable
DROP TABLE `recipe_translations`;

-- DropTable
DROP TABLE `tag_translations`;

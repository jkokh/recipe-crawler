/*
  Warnings:

  - You are about to drop the `_RecipeImageToRecipeStep` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_step_images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `step_id` to the `recipe_images` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_RecipeImageToRecipeStep` DROP FOREIGN KEY `_RecipeImageToRecipeStep_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RecipeImageToRecipeStep` DROP FOREIGN KEY `_RecipeImageToRecipeStep_B_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_images` DROP FOREIGN KEY `recipe_images_recipe_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_step_images` DROP FOREIGN KEY `recipe_step_images_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_step_images` DROP FOREIGN KEY `recipe_step_images_recipe_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_step_images` DROP FOREIGN KEY `recipe_step_images_step_id_fkey`;

-- AlterTable
ALTER TABLE `recipe_images` ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `step_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `_RecipeImageToRecipeStep`;

-- DropTable
DROP TABLE `recipe_step_images`;

-- CreateIndex
CREATE INDEX `idx_recipe_images_step_order` ON `recipe_images`(`step_id`, `order`);

-- AddForeignKey
ALTER TABLE `recipe_images` ADD CONSTRAINT `recipe_images_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_images` ADD CONSTRAINT `recipe_images_step_id_fkey` FOREIGN KEY (`step_id`) REFERENCES `recipe_step`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

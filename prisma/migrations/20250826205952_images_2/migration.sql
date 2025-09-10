/*
  Warnings:

  - You are about to drop the `recipe_step_image_link` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `recipe_step_image_link` DROP FOREIGN KEY `recipe_step_image_link_recipe_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_step_image_link` DROP FOREIGN KEY `recipe_step_image_link_recipe_step_id_fkey`;

-- DropTable
DROP TABLE `recipe_step_image_link`;

-- CreateTable
CREATE TABLE `_RecipeImageToRecipeStep` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RecipeImageToRecipeStep_AB_unique`(`A`, `B`),
    INDEX `_RecipeImageToRecipeStep_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_RecipeImageToRecipeStep` ADD CONSTRAINT `_RecipeImageToRecipeStep_A_fkey` FOREIGN KEY (`A`) REFERENCES `recipe_images`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecipeImageToRecipeStep` ADD CONSTRAINT `_RecipeImageToRecipeStep_B_fkey` FOREIGN KEY (`B`) REFERENCES `recipe_step`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

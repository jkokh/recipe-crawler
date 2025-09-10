/*
  Warnings:

  - You are about to drop the `_RecipeToRecipeUrlImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_RecipeToRecipeUrlImage` DROP FOREIGN KEY `_RecipeToRecipeUrlImage_A_fkey`;

-- DropForeignKey
ALTER TABLE `_RecipeToRecipeUrlImage` DROP FOREIGN KEY `_RecipeToRecipeUrlImage_B_fkey`;

-- DropTable
DROP TABLE `_RecipeToRecipeUrlImage`;

-- CreateTable
CREATE TABLE `recipe_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_id` INTEGER NOT NULL,
    `image_url` TEXT NOT NULL,
    `alt_text` VARCHAR(1024) NULL,
    `valid` BOOLEAN NOT NULL DEFAULT true,

    INDEX `idx_recipe_images_recipe_id`(`recipe_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recipe_images` ADD CONSTRAINT `recipe_images_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

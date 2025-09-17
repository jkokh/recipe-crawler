-- AddForeignKey
ALTER TABLE `recipe_categories` ADD CONSTRAINT `recipe_categories_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

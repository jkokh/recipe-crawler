-- DropForeignKey
ALTER TABLE `ingredient_translations` DROP FOREIGN KEY `ingredient_translation_ingredient_id_fkey`;

-- DropForeignKey
ALTER TABLE `nutrition_translations` DROP FOREIGN KEY `nutrition_translation_nutrition_id_fkey`;

-- DropForeignKey
ALTER TABLE `nutritions` DROP FOREIGN KEY `nutrition_recipe_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_ingredient_translations` DROP FOREIGN KEY `recipe_ingredient_translation_recipe_ingredient_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_ingredients` DROP FOREIGN KEY `recipe_ingredient_ingredient_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_ingredients` DROP FOREIGN KEY `recipe_ingredient_recipe_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_metas` DROP FOREIGN KEY `recipe_meta_recipe_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_step_translations` DROP FOREIGN KEY `recipe_step_translation_recipe_step_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_steps` DROP FOREIGN KEY `recipe_step_recipe_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_tag_links` DROP FOREIGN KEY `recipe_tag_link_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_tag_links` DROP FOREIGN KEY `recipe_tag_link_tagId_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_translations` DROP FOREIGN KEY `recipe_translation_recipe_id_fkey`;

-- DropForeignKey
ALTER TABLE `tag_translations` DROP FOREIGN KEY `tag_translation_tag_id_fkey`;

-- AddForeignKey
ALTER TABLE `tag_translations` ADD CONSTRAINT `tag_translations_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_tag_links` ADD CONSTRAINT `recipe_tag_links_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_tag_links` ADD CONSTRAINT `recipe_tag_links_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingredient_translations` ADD CONSTRAINT `ingredient_translations_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_translations` ADD CONSTRAINT `recipe_translations_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredients` ADD CONSTRAINT `recipe_ingredients_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredients` ADD CONSTRAINT `recipe_ingredients_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredient_translations` ADD CONSTRAINT `recipe_ingredient_translations_recipe_ingredient_id_fkey` FOREIGN KEY (`recipe_ingredient_id`) REFERENCES `recipe_ingredients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_steps` ADD CONSTRAINT `recipe_steps_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_step_translations` ADD CONSTRAINT `recipe_step_translations_recipe_step_id_fkey` FOREIGN KEY (`recipe_step_id`) REFERENCES `recipe_steps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nutritions` ADD CONSTRAINT `nutritions_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nutrition_translations` ADD CONSTRAINT `nutrition_translations_nutrition_id_fkey` FOREIGN KEY (`nutrition_id`) REFERENCES `nutritions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_metas` ADD CONSTRAINT `recipe_metas_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `ingredient_translations` RENAME INDEX `ingredient_translation_ingredient_id_language_code_key` TO `ingredient_translations_ingredient_id_language_code_key`;

-- RenameIndex
ALTER TABLE `ingredients` RENAME INDEX `ingredient_slug_key` TO `ingredients_slug_key`;

-- RenameIndex
ALTER TABLE `nutrition_translations` RENAME INDEX `nutrition_translation_language_code_idx` TO `nutrition_translations_language_code_idx`;

-- RenameIndex
ALTER TABLE `nutrition_translations` RENAME INDEX `nutrition_translation_nutrition_id_language_code_key` TO `nutrition_translations_nutrition_id_language_code_key`;

-- RenameIndex
ALTER TABLE `nutritions` RENAME INDEX `nutrition_recipe_id_idx` TO `nutritions_recipe_id_idx`;

-- RenameIndex
ALTER TABLE `recipe_ingredient_translations` RENAME INDEX `recipe_ingredient_translation_recipe_ingredient_id_languageC_key` TO `recipe_ingredient_translations_recipe_ingredient_id_language_key`;

-- RenameIndex
ALTER TABLE `recipe_metas` RENAME INDEX `recipe_meta_recipe_id_key_key` TO `recipe_metas_recipe_id_key_key`;

-- RenameIndex
ALTER TABLE `recipe_step_translations` RENAME INDEX `recipe_step_translation_recipe_step_id_languageCode_key` TO `recipe_step_translations_recipe_step_id_languageCode_key`;

-- RenameIndex
ALTER TABLE `recipe_translations` RENAME INDEX `recipe_translation_recipe_id_languageCode_key` TO `recipe_translations_recipe_id_languageCode_key`;

-- RenameIndex
ALTER TABLE `recipes` RENAME INDEX `recipe_slug_key` TO `recipes_slug_key`;

-- RenameIndex
ALTER TABLE `tag_translations` RENAME INDEX `tag_translation_tag_id_language_code_key` TO `tag_translations_tag_id_language_code_key`;

-- RenameIndex
ALTER TABLE `tags` RENAME INDEX `tag_slug_key` TO `tags_slug_key`;

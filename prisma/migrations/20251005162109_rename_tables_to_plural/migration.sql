-- Rename main tables
RENAME TABLE `language` TO `languages`;
RENAME TABLE `tag` TO `tags`;
RENAME TABLE `ingredient` TO `ingredients`;
RENAME TABLE `recipe` TO `recipes`;
RENAME TABLE `nutrition` TO `nutritions`;

-- Rename translation and join tables
RENAME TABLE `tag_translation` TO `tag_translations`;
RENAME TABLE `recipe_tag_link` TO `recipe_tag_links`;
RENAME TABLE `ingredient_translation` TO `ingredient_translations`;
RENAME TABLE `recipe_translation` TO `recipe_translations`;
RENAME TABLE `recipe_ingredient` TO `recipe_ingredients`;
RENAME TABLE `recipe_ingredient_translation` TO `recipe_ingredient_translations`;
RENAME TABLE `recipe_step` TO `recipe_steps`;
RENAME TABLE `recipe_step_translation` TO `recipe_step_translations`;
RENAME TABLE `nutrition_translation` TO `nutrition_translations`;
RENAME TABLE `recipe_meta` TO `recipe_metas`;
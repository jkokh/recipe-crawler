-- AlterTable
ALTER TABLE `recipe_urls` ADD COLUMN `json_altered` LONGTEXT NULL,
    ADD COLUMN `json_altered_history` LONGTEXT NULL,
    ADD COLUMN `json_history` LONGTEXT NULL;

/*
  Warnings:

  - The primary key for the `ingredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ingredient_translation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `recipe_ingredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `recipe_ingredient_translation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `ingredient_translation` DROP FOREIGN KEY `ingredient_translation_ingredient_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_ingredient` DROP FOREIGN KEY `recipe_ingredient_ingredient_id_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_ingredient_translation` DROP FOREIGN KEY `recipe_ingredient_translation_recipe_ingredient_id_fkey`;

-- AlterTable
ALTER TABLE `ingredient` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `ingredient_translation` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `ingredient_id` BIGINT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `recipe_ingredient` DROP PRIMARY KEY,
    ADD COLUMN `source` ENUM('DOM', 'TEXT', 'GPT', 'OLLAMA') NOT NULL DEFAULT 'DOM',
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `ingredient_id` BIGINT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `recipe_ingredient_translation` DROP PRIMARY KEY,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `recipe_ingredient_id` BIGINT NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `ingredient_translation` ADD CONSTRAINT `ingredient_translation_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredient` ADD CONSTRAINT `recipe_ingredient_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredient_translation` ADD CONSTRAINT `recipe_ingredient_translation_recipe_ingredient_id_fkey` FOREIGN KEY (`recipe_ingredient_id`) REFERENCES `recipe_ingredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

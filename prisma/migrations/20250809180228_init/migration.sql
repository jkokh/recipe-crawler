-- CreateTable
CREATE TABLE `recipe_urls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_url` VARCHAR(191) NOT NULL,
    `recipe_date` DATETIME(3) NULL,
    `html_content` LONGTEXT NULL,
    `html_clean` LONGTEXT NULL,

    UNIQUE INDEX `recipe_urls_recipe_url_key`(`recipe_url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_url_id` INTEGER NOT NULL,
    `image_url` TEXT NOT NULL,
    `alt_text` VARCHAR(191) NULL,
    `valid` BOOLEAN NOT NULL DEFAULT true,
    `type` VARCHAR(191) NULL,

    INDEX `idx_recipe_images_recipe_url_id`(`recipe_url_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `language` (
    `code` VARCHAR(8) NOT NULL,
    `title` VARCHAR(64) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `canonical_name` VARCHAR(255) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `ingredient_canonical_name_key`(`canonical_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredient_translation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ingredient_id` INTEGER NOT NULL,
    `language_code` VARCHAR(8) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `ingredient_translation_ingredient_id_language_code_key`(`ingredient_id`, `language_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `canonical_name` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `tag_canonical_name_key`(`canonical_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag_translation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tag_id` INTEGER NOT NULL,
    `language_code` VARCHAR(8) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `tag_translation_tag_id_language_code_key`(`tag_id`, `language_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_tag_link` (
    `recipeId` INTEGER NOT NULL,
    `tagId` INTEGER NOT NULL,

    PRIMARY KEY (`recipeId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_ingredient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_id` INTEGER NOT NULL,
    `ingredient_id` INTEGER NULL,
    `rawText` VARCHAR(255) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_ingredient_translation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_ingredient_id` INTEGER NOT NULL,
    `languageCode` VARCHAR(8) NOT NULL,
    `translatedText` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `recipe_ingredient_translation_recipe_ingredient_id_languageC_key`(`recipe_ingredient_id`, `languageCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_step` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_id` INTEGER NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `rawText` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_step_translation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_step_id` INTEGER NOT NULL,
    `languageCode` VARCHAR(8) NOT NULL,
    `translatedText` TEXT NOT NULL,

    UNIQUE INDEX `recipe_step_translation_recipe_step_id_languageCode_key`(`recipe_step_id`, `languageCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_step_image_link` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_step_id` INTEGER NOT NULL,
    `recipe_image_id` INTEGER NOT NULL,

    UNIQUE INDEX `recipe_step_image_link_recipe_step_id_recipe_image_id_key`(`recipe_step_id`, `recipe_image_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `recipe_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_translation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_id` INTEGER NOT NULL,
    `languageCode` VARCHAR(8) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `recipe_translation_recipe_id_languageCode_key`(`recipe_id`, `languageCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recipe_images` ADD CONSTRAINT `recipe_images_recipe_url_id_fkey` FOREIGN KEY (`recipe_url_id`) REFERENCES `recipe_urls`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingredient_translation` ADD CONSTRAINT `ingredient_translation_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tag_translation` ADD CONSTRAINT `tag_translation_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_tag_link` ADD CONSTRAINT `recipe_tag_link_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_tag_link` ADD CONSTRAINT `recipe_tag_link_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredient` ADD CONSTRAINT `recipe_ingredient_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredient` ADD CONSTRAINT `recipe_ingredient_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredient_translation` ADD CONSTRAINT `recipe_ingredient_translation_recipe_ingredient_id_fkey` FOREIGN KEY (`recipe_ingredient_id`) REFERENCES `recipe_ingredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_step` ADD CONSTRAINT `recipe_step_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_step_translation` ADD CONSTRAINT `recipe_step_translation_recipe_step_id_fkey` FOREIGN KEY (`recipe_step_id`) REFERENCES `recipe_step`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_step_image_link` ADD CONSTRAINT `recipe_step_image_link_recipe_step_id_fkey` FOREIGN KEY (`recipe_step_id`) REFERENCES `recipe_step`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_step_image_link` ADD CONSTRAINT `recipe_step_image_link_recipe_image_id_fkey` FOREIGN KEY (`recipe_image_id`) REFERENCES `recipe_images`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_translation` ADD CONSTRAINT `recipe_translation_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

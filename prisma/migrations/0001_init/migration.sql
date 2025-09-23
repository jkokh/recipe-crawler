-- CreateTable
CREATE TABLE `language` (
    `code` VARCHAR(8) NOT NULL,
    `title` VARCHAR(64) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parentId` INTEGER NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `description` TEXT NULL,
    `keywords` JSON NULL,

    INDEX `categories_parentId_idx`(`parentId`),
    INDEX `categories_slug_idx`(`slug`),
    UNIQUE INDEX `categories_parentId_slug_key`(`parentId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `slug` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `tag_slug_key`(`slug`),
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

    INDEX `recipe_tag_link_tagId_fkey`(`tagId`),
    PRIMARY KEY (`recipeId`, `tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredient` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ingredient_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ingredient_translation` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `ingredient_id` BIGINT NOT NULL,
    `language_code` VARCHAR(8) NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `ingredient_translation_ingredient_id_language_code_key`(`ingredient_id`, `language_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `seo` VARCHAR(255) NULL,

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

-- CreateTable
CREATE TABLE `recipe_ingredient` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `recipe_id` INTEGER NOT NULL,
    `ingredient_id` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `text` VARCHAR(255) NOT NULL,
    `source` ENUM('DOM', 'TEXT', 'GPT', 'OLLAMA') NOT NULL DEFAULT 'DOM',

    INDEX `recipe_ingredient_ingredient_id_fkey`(`ingredient_id`),
    INDEX `recipe_ingredient_recipe_id_fkey`(`recipe_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_ingredient_translation` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `recipe_ingredient_id` BIGINT NOT NULL,
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
    `text` TEXT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `source` ENUM('DOM', 'TEXT', 'GPT', 'OLLAMA') NOT NULL DEFAULT 'DOM',
    `textAlt` TEXT NULL,
    `titleAlt` VARCHAR(255) NULL,

    INDEX `recipe_step_recipe_id_fkey`(`recipe_id`),
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
CREATE TABLE `nutrition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_id` INTEGER NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `value` VARCHAR(255) NOT NULL,

    INDEX `nutrition_recipe_id_idx`(`recipe_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nutrition_translation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nutrition_id` INTEGER NOT NULL,
    `language_code` VARCHAR(8) NOT NULL,
    `text` VARCHAR(255) NOT NULL,

    INDEX `nutrition_translation_language_code_idx`(`language_code`),
    UNIQUE INDEX `nutrition_translation_nutrition_id_language_code_key`(`nutrition_id`, `language_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_url_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_url_id` INTEGER NOT NULL,
    `image_url` TEXT NOT NULL,
    `alt_text` VARCHAR(1024) NULL,
    `valid` BOOLEAN NOT NULL DEFAULT true,
    `type` VARCHAR(191) NULL,

    INDEX `idx_recipe_images_recipe_url_id`(`recipe_url_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_categories` (
    `recipeId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,

    INDEX `recipe_categories_categoryId_recipeId_idx`(`categoryId`, `recipeId`),
    PRIMARY KEY (`recipeId`, `categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_meta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_id` INTEGER NOT NULL,
    `key` VARCHAR(128) NOT NULL,
    `value` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `idx_recipe_meta_recipe_id`(`recipe_id`),
    UNIQUE INDEX `recipe_meta_recipe_id_key_key`(`recipe_id`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phrases` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(64) NOT NULL,
    `text` LONGTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `phrases_hash_key`(`hash`),
    INDEX `phrases_hash_idx`(`hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sources` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_url` VARCHAR(191) NOT NULL,
    `recipe_date` DATETIME(3) NULL,
    `html_content` LONGTEXT NULL,
    `recipe_id` INTEGER NULL,
    `batch_id` JSON NULL,
    `json` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `recipe_urls_recipe_id_key`(`recipe_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `source_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_id` INTEGER NOT NULL,
    `alt` VARCHAR(1024) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_lead` BOOLEAN NOT NULL DEFAULT false,
    `source_id` INTEGER NULL,
    `stable_id` CHAR(40) NULL,
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `url` TEXT NULL,

    INDEX `source_images_source_id_idx`(`source_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tag_translation` ADD CONSTRAINT `tag_translation_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_tag_link` ADD CONSTRAINT `recipe_tag_link_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_tag_link` ADD CONSTRAINT `recipe_tag_link_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ingredient_translation` ADD CONSTRAINT `ingredient_translation_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_translation` ADD CONSTRAINT `recipe_translation_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredient` ADD CONSTRAINT `recipe_ingredient_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredient` ADD CONSTRAINT `recipe_ingredient_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredient_translation` ADD CONSTRAINT `recipe_ingredient_translation_recipe_ingredient_id_fkey` FOREIGN KEY (`recipe_ingredient_id`) REFERENCES `recipe_ingredient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_step` ADD CONSTRAINT `recipe_step_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_step_translation` ADD CONSTRAINT `recipe_step_translation_recipe_step_id_fkey` FOREIGN KEY (`recipe_step_id`) REFERENCES `recipe_step`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nutrition` ADD CONSTRAINT `nutrition_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `nutrition_translation` ADD CONSTRAINT `nutrition_translation_nutrition_id_fkey` FOREIGN KEY (`nutrition_id`) REFERENCES `nutrition`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_url_images` ADD CONSTRAINT `recipe_images_recipe_url_id_fkey` FOREIGN KEY (`recipe_url_id`) REFERENCES `sources`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_categories` ADD CONSTRAINT `recipe_categories_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_categories` ADD CONSTRAINT `recipe_categories_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_meta` ADD CONSTRAINT `recipe_meta_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sources` ADD CONSTRAINT `recipe_urls_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `source_images` ADD CONSTRAINT `source_images_source_id_fkey` FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


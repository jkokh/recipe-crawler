-- CreateTable
CREATE TABLE `recipe_urls` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_url` VARCHAR(191) NOT NULL,
    `recipe_date` DATETIME(3) NULL,
    `html_content` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `recipe_urls_recipe_url_key`(`recipe_url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_url_id` INTEGER NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `alt_text` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recipe_images` ADD CONSTRAINT `recipe_images_recipe_url_id_fkey` FOREIGN KEY (`recipe_url_id`) REFERENCES `recipe_urls`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

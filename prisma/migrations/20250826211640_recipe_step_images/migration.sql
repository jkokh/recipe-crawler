-- CreateTable
CREATE TABLE `recipe_step_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipe_id` INTEGER NOT NULL,
    `step_id` INTEGER NOT NULL,
    `image_id` INTEGER NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_step_img_recipe_id`(`recipe_id`),
    INDEX `idx_step_img_step_order`(`step_id`, `order`),
    UNIQUE INDEX `recipe_step_images_step_id_image_id_key`(`step_id`, `image_id`),
    UNIQUE INDEX `recipe_step_images_step_id_order_key`(`step_id`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `recipe_step_images` ADD CONSTRAINT `recipe_step_images_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_step_images` ADD CONSTRAINT `recipe_step_images_step_id_fkey` FOREIGN KEY (`step_id`) REFERENCES `recipe_step`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_step_images` ADD CONSTRAINT `recipe_step_images_image_id_fkey` FOREIGN KEY (`image_id`) REFERENCES `recipe_images`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

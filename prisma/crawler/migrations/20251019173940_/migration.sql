-- CreateTable
CREATE TABLE `publication_queue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `source_id` INTEGER NOT NULL,
    `scheduled_at` DATETIME(3) NOT NULL,
    `status` ENUM('pending', 'published', 'failed', 'canceled') NOT NULL DEFAULT 'pending',

    UNIQUE INDEX `publication_queue_source_id_key`(`source_id`),
    INDEX `idx_pubq_scheduled_at`(`scheduled_at`),
    INDEX `idx_pubq_status_scheduled_at`(`status`, `scheduled_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `publication_queue` ADD CONSTRAINT `publication_queue_source_id_fkey` FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

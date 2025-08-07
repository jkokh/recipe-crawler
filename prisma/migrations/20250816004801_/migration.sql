/*
  Warnings:

  - You are about to drop the column `titleAdded` on the `recipe_urls` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recipe_id]` on the table `recipe_urls` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `recipe_urls` DROP COLUMN `titleAdded`;

-- CreateIndex
CREATE UNIQUE INDEX `recipe_urls_recipe_id_key` ON `recipe_urls`(`recipe_id`);

-- AddForeignKey
ALTER TABLE `recipe_urls` ADD CONSTRAINT `recipe_urls_recipe_id_fkey` FOREIGN KEY (`recipe_id`) REFERENCES `recipe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

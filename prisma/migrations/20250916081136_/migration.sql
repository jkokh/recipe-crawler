/*
  Warnings:

  - You are about to drop the column `json_altered` on the `recipe_urls` table. All the data in the column will be lost.
  - You are about to drop the column `json_altered_history` on the `recipe_urls` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `recipe_urls` DROP COLUMN `json_altered`,
    DROP COLUMN `json_altered_history`,
    ADD COLUMN `json` JSON NULL,
    ADD COLUMN `json_history` JSON NULL;

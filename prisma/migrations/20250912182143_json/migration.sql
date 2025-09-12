/*
  Warnings:

  - You are about to alter the column `json_altered` on the `recipe_urls` table. The data in that column could be lost. The data in that column will be cast from `LongText` to `Json`.
  - You are about to alter the column `json_altered_history` on the `recipe_urls` table. The data in that column could be lost. The data in that column will be cast from `LongText` to `Json`.
  - You are about to alter the column `json_history` on the `recipe_urls` table. The data in that column could be lost. The data in that column will be cast from `LongText` to `Json`.

*/
-- AlterTable
ALTER TABLE `recipe_urls` MODIFY `json_altered` JSON NULL,
    MODIFY `json_altered_history` JSON NULL,
    MODIFY `json_history` JSON NULL;

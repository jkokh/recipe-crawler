/*
  Warnings:

  - You are about to drop the column `json` on the `recipe_urls` table. All the data in the column will be lost.
  - You are about to drop the column `json_history` on the `recipe_urls` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `recipe_urls` DROP COLUMN `json`,
    DROP COLUMN `json_history`;

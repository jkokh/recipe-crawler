/*
  Warnings:

  - A unique constraint covering the columns `[recipe_url]` on the table `sources` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `sources_recipe_url_key` ON `sources`(`recipe_url`);

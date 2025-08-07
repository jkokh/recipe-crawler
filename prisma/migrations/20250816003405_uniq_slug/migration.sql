/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `recipe_slug_key` ON `recipe`(`slug`);

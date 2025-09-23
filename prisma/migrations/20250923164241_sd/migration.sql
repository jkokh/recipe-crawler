/*
  Warnings:

  - A unique constraint covering the columns `[source_id,stable_id]` on the table `source_images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX `idx_recipe_images_step_order` ON `source_images`(`order`);

-- CreateIndex
CREATE UNIQUE INDEX `source_images_source_id_stable_id_key` ON `source_images`(`source_id`, `stable_id`);

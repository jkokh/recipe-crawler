/*
  Warnings:

  - A unique constraint covering the columns `[source_id,hash,version,index]` on the table `phrases` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `phrases_source_id_hash_version_key` ON `phrases`;

-- CreateIndex
CREATE UNIQUE INDEX `phrases_source_id_hash_version_index_key` ON `phrases`(`source_id`, `hash`, `version`, `index`);

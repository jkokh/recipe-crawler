/*
  Warnings:

  - You are about to drop the `tag_alias` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tag_alias` DROP FOREIGN KEY `tag_alias_tag_id_fkey`;

-- DropTable
DROP TABLE `tag_alias`;

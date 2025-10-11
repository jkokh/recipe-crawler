-- DropIndex
DROP INDEX `phrases_type_source_id_version_key` ON `phrases`;

-- CreateIndex
CREATE INDEX `sources_version_idx` ON `sources`(`version`);

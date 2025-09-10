-- AlterTable
ALTER TABLE `recipe_step` ADD COLUMN `source` ENUM('DOM', 'TEXT', 'GPT', 'OLLAMA') NOT NULL DEFAULT 'DOM';

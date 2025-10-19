/*
  Warnings:

  - A unique constraint covering the columns `[sourceId]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sourceId` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Recipe_recipeId_key";

-- AlterTable
ALTER TABLE "public"."Recipe" ADD COLUMN     "sourceId" INTEGER NOT NULL,
ALTER COLUMN "recipeId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_sourceId_key" ON "public"."Recipe"("sourceId");

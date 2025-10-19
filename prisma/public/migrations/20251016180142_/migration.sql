/*
  Warnings:

  - The primary key for the `Ingredient` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_RecipeIngredients` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."_RecipeIngredients" DROP CONSTRAINT "_RecipeIngredients_A_fkey";

-- AlterTable
ALTER TABLE "public"."Ingredient" DROP CONSTRAINT "Ingredient_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."_RecipeIngredients" DROP CONSTRAINT "_RecipeIngredients_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE BIGINT,
ADD CONSTRAINT "_RecipeIngredients_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "public"."_RecipeIngredients" ADD CONSTRAINT "_RecipeIngredients_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

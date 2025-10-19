-- CreateTable
CREATE TABLE "public"."Recipe" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "json" JSONB NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" INTEGER NOT NULL,
    "parentId" INTEGER,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "keywords" JSONB,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ingredient" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_RecipeTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RecipeTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_RecipeCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RecipeCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_RecipeIngredients" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RecipeIngredients_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_recipeId_key" ON "public"."Recipe"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_slug_key" ON "public"."Recipe"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "public"."Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_slug_key" ON "public"."Ingredient"("slug");

-- CreateIndex
CREATE INDEX "_RecipeTags_B_index" ON "public"."_RecipeTags"("B");

-- CreateIndex
CREATE INDEX "_RecipeCategories_B_index" ON "public"."_RecipeCategories"("B");

-- CreateIndex
CREATE INDEX "_RecipeIngredients_B_index" ON "public"."_RecipeIngredients"("B");

-- AddForeignKey
ALTER TABLE "public"."_RecipeTags" ADD CONSTRAINT "_RecipeTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RecipeTags" ADD CONSTRAINT "_RecipeTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RecipeCategories" ADD CONSTRAINT "_RecipeCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RecipeCategories" ADD CONSTRAINT "_RecipeCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RecipeIngredients" ADD CONSTRAINT "_RecipeIngredients_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RecipeIngredients" ADD CONSTRAINT "_RecipeIngredients_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

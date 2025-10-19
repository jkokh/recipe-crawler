-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EntityType" AS ENUM ('PRODUCT', 'CATEGORY', 'USER');

-- CreateEnum
CREATE TYPE "public"."FileExtension" AS ENUM ('jpg', 'png');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "verifyToken" TEXT,
    "resetToken" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "tokenCreatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "resetTokenCreatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "birthdate" TIMESTAMP(3),
    "gender" "public"."Gender",

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."token_validity" (
    "userId" INTEGER NOT NULL,
    "deviceId" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_validity_pkey" PRIMARY KEY ("userId","deviceId")
);

-- CreateTable
CREATE TABLE "public"."_RecipeToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RecipeToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_verifyToken_key" ON "public"."users"("verifyToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_resetToken_key" ON "public"."users"("resetToken");

-- CreateIndex
CREATE INDEX "idx_tokenCreatedAt" ON "public"."users"("tokenCreatedAt");

-- CreateIndex
CREATE INDEX "_RecipeToUser_B_index" ON "public"."_RecipeToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."_RecipeToUser" ADD CONSTRAINT "_RecipeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_RecipeToUser" ADD CONSTRAINT "_RecipeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

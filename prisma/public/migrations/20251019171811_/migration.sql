/*
  Warnings:

  - You are about to drop the `token_validity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_RecipeToUser" DROP CONSTRAINT "_RecipeToUser_B_fkey";

-- DropTable
DROP TABLE "public"."token_validity";

-- DropTable
DROP TABLE "public"."users";

-- CreateTable
CREATE TABLE "public"."User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TokenValidity" (
    "userId" INTEGER NOT NULL,
    "deviceId" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenValidity_pkey" PRIMARY KEY ("userId","deviceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_verifyToken_key" ON "public"."User"("verifyToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "public"."User"("resetToken");

-- CreateIndex
CREATE INDEX "idx_tokenCreatedAt" ON "public"."User"("tokenCreatedAt");

-- AddForeignKey
ALTER TABLE "public"."_RecipeToUser" ADD CONSTRAINT "_RecipeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

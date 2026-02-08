/*
  Warnings:

  - A unique constraint covering the columns `[confirmationToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetToken]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "confirmationToken" TEXT,
ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resetToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_confirmationToken_key" ON "users"("confirmationToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_resetToken_key" ON "users"("resetToken");

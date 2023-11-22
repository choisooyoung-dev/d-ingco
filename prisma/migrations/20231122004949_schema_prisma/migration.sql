/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `USER` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `USER_email_key` ON `USER`(`email`);

/*
  Warnings:

  - Added the required column `firstName` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "firstName" VARCHAR(64) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(64) NOT NULL,
ADD COLUMN     "phoneNumber" VARCHAR(20);

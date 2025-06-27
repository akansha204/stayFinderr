/*
  Warnings:

  - You are about to drop the column `baths` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `sqft` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "baths",
DROP COLUMN "sqft",
ADD COLUMN     "adults" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "children" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rooms" INTEGER NOT NULL DEFAULT 1;

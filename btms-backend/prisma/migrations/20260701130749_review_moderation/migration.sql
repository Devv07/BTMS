-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PUBLISHED', 'HIDDEN', 'REPORTED');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "ReviewStatus" NOT NULL DEFAULT 'PUBLISHED';

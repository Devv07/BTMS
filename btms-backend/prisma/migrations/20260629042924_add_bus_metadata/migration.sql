/*
  Warnings:

  - A unique constraint covering the columns `[busNumber]` on the table `Bus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seatTemplate` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Bus` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Bus" ADD COLUMN     "amenities" JSONB,
ADD COLUMN     "operatorName" TEXT,
ADD COLUMN     "seatTemplate" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "type",
ADD COLUMN     "type" "BusType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Bus_busNumber_key" ON "Bus"("busNumber");

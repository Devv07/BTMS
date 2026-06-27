/*
  Warnings:

  - You are about to alter the column `totalPrice` on the `Booking` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `seatConfig` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seatLayout` to the `Bus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Bus` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'LOCKED', 'BOOKED');

-- CreateEnum
CREATE TYPE "BusType" AS ENUM ('AC', 'NON_AC', 'DELUXE', 'SLEEPER', 'EV', 'MINI', 'MICRO');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- DropIndex
DROP INDEX "Booking_ticketNumber_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "totalPrice" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Bus" ADD COLUMN     "amenities" JSONB,
ADD COLUMN     "operatorName" TEXT,
ADD COLUMN     "seatConfig" JSONB NOT NULL,
ADD COLUMN     "seatLayout" JSONB NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "type" "BusType" NOT NULL;

-- CreateTable
CREATE TABLE "Seat" (
    "id" TEXT NOT NULL,
    "seatNumber" TEXT NOT NULL,
    "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE',
    "isHeld" BOOLEAN NOT NULL DEFAULT false,
    "holdExpiry" TIMESTAMP(3),
    "busId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "row" INTEGER,
    "col" INTEGER,
    "bookingId" TEXT,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seat_busId_seatNumber_key" ON "Seat"("busId", "seatNumber");

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_busId_fkey" FOREIGN KEY ("busId") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

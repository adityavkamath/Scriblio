/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shareToken` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "shareToken" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "RoomWrite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "RoomWrite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomWrite_userId_roomId_key" ON "RoomWrite"("userId", "roomId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_shareToken_key" ON "Room"("shareToken");

-- AddForeignKey
ALTER TABLE "RoomWrite" ADD CONSTRAINT "RoomWrite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomWrite" ADD CONSTRAINT "RoomWrite_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

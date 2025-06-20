/*
  Warnings:

  - You are about to drop the `_RoomUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RoomUsers" DROP CONSTRAINT "_RoomUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomUsers" DROP CONSTRAINT "_RoomUsers_B_fkey";

-- DropTable
DROP TABLE "_RoomUsers";

-- CreateTable
CREATE TABLE "RoomUser" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permission" "Permission" NOT NULL DEFAULT 'VIEW',

    CONSTRAINT "RoomUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomUser_roomId_userId_key" ON "RoomUser"("roomId", "userId");

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomUser" ADD CONSTRAINT "RoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

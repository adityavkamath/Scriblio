-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('VIEW', 'WRITE');

-- CreateTable
CREATE TABLE "PendingGuest" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "permission" "Permission" NOT NULL DEFAULT 'VIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingGuest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PendingGuest" ADD CONSTRAINT "PendingGuest_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

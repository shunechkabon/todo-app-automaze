/*
  Warnings:

  - You are about to drop the column `completed` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "completed",
ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "priority" SET DEFAULT 5;

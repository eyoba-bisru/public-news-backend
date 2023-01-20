/*
  Warnings:

  - You are about to drop the `Notice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_NoticeToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_NoticeToUser" DROP CONSTRAINT "_NoticeToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_NoticeToUser" DROP CONSTRAINT "_NoticeToUser_B_fkey";

-- DropTable
DROP TABLE "Notice";

-- DropTable
DROP TABLE "_NoticeToUser";

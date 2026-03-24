/*
  Warnings:

  - You are about to drop the `_GroupToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EducationType" AS ENUM ('SCHOOL', 'UNIVERSITY', 'OTHER');

-- CreateEnum
CREATE TYPE "GroupStatus" AS ENUM ('PENDING', 'ACTIVE', 'FULL', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GroupStudentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "_GroupToStudent" DROP CONSTRAINT "_GroupToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToStudent" DROP CONSTRAINT "_GroupToStudent_B_fkey";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "curriculumId" UUID,
ADD COLUMN     "status" "GroupStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "birthDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "educationType" "EducationType",
ADD COLUMN     "grade" INTEGER;

-- DropTable
DROP TABLE "_GroupToStudent";

-- CreateTable
CREATE TABLE "GroupStudent" (
    "groupId" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "status" "GroupStudentStatus" NOT NULL DEFAULT 'PENDING',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupStudent_pkey" PRIMARY KEY ("groupId","studentId")
);

-- CreateTable
CREATE TABLE "Curriculum" (
    "id" UUID NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" VARCHAR(255),
    "minAge" INTEGER,
    "maxAge" INTEGER,
    "minGrade" INTEGER,
    "maxGrade" INTEGER,
    "educationType" "EducationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileCurriculum" (
    "profileId" UUID NOT NULL,
    "curriculumId" UUID NOT NULL,

    CONSTRAINT "ProfileCurriculum_pkey" PRIMARY KEY ("profileId","curriculumId")
);

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupStudent" ADD CONSTRAINT "GroupStudent_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupStudent" ADD CONSTRAINT "GroupStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileCurriculum" ADD CONSTRAINT "ProfileCurriculum_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileCurriculum" ADD CONSTRAINT "ProfileCurriculum_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

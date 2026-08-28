-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'DISAPPROVED');

-- CreateEnum
CREATE TYPE "AttendanceType" AS ENUM ('CEREMONY_AND_RESTAURANT', 'CEREMONY_ONLY');

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "willAttend" BOOLEAN NOT NULL,
    "attendanceType" "AttendanceType",
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "contactName" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "isCompanion" BOOLEAN NOT NULL DEFAULT false,
    "fullName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "messageText" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Submission_willAttend_approvalStatus_idx" ON "Submission"("willAttend", "approvalStatus");

-- CreateIndex
CREATE INDEX "Submission_attendanceType_idx" ON "Submission"("attendanceType");

-- CreateIndex
CREATE INDEX "Submission_createdAt_idx" ON "Submission"("createdAt");

-- CreateIndex
CREATE INDEX "Person_submissionId_idx" ON "Person"("submissionId");

-- CreateIndex
CREATE INDEX "Message_approved_createdAt_idx" ON "Message"("approved", "createdAt");

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

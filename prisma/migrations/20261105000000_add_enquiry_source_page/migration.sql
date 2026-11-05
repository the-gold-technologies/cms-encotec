-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN "sourcePage" TEXT;

-- CreateIndex
CREATE INDEX "Enquiry_sourcePage_idx" ON "Enquiry"("sourcePage");

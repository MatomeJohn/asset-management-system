-- AlterTable
ALTER TABLE "maintenance_records" ADD COLUMN "nextMaintenanceDate" DATETIME;

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT,
    "action" TEXT NOT NULL,
    "changes" TEXT,
    "userId" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "audit_logs_assetId_idx" ON "audit_logs"("assetId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

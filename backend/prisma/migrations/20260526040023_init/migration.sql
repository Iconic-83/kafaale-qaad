-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'reporter',
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "country" TEXT,
    "city" TEXT,
    "organization" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reporterId" TEXT,
    "assignedAgentId" TEXT,
    "privateVictimName" TEXT,
    "privateVictimPhone" TEXT,
    "privateAddress" TEXT,
    "privateGpsLat" REAL,
    "privateGpsLng" REAL,
    "privateFamilySize" INTEGER,
    "privateVictimAge" INTEGER,
    "privateVictimGender" TEXT,
    "privateDescription" TEXT NOT NULL,
    "privateNotes" TEXT,
    "category" TEXT NOT NULL DEFAULT 'other',
    "emergencyLevel" TEXT NOT NULL DEFAULT 'medium',
    "supportType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending_review',
    "rejectedAt" DATETIME,
    "rejectionReason" TEXT,
    "targetGoal" REAL NOT NULL DEFAULT 0,
    "totalRaised" REAL NOT NULL DEFAULT 0,
    "escrowReleased" REAL NOT NULL DEFAULT 0,
    "publicTitle" TEXT,
    "publicStory" TEXT,
    "publicCity" TEXT,
    "publicCountry" TEXT,
    "publicMediaUrls" TEXT,
    "aiSanitizedAt" DATETIME,
    "adminPublishedAt" DATETIME,
    "teamAssignedAt" DATETIME,
    "investigationCompletedAt" DATETIME,
    "sponsoredAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Case_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Case_assignedAgentId_fkey" FOREIGN KEY ("assignedAgentId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CaseMedia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'image',
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "flagReason" TEXT,
    "uploadedBy" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CaseMedia_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FieldInvestigation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "victimVerified" BOOLEAN NOT NULL DEFAULT false,
    "situationAccurate" BOOLEAN NOT NULL DEFAULT false,
    "situationNotes" TEXT,
    "gpsVerificationLat" REAL,
    "gpsVerificationLng" REAL,
    "estimatedAmountNeeded" REAL NOT NULL DEFAULT 0,
    "urgencyConfirmed" TEXT,
    "deliveryFeasible" BOOLEAN NOT NULL DEFAULT true,
    "deliveryMethod" TEXT,
    "deliveryNotes" TEXT,
    "fraudRiskScore" INTEGER NOT NULL DEFAULT 0,
    "fraudRiskLevel" TEXT NOT NULL DEFAULT 'low',
    "fraudRiskNotes" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'needs_review',
    "officialNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FieldInvestigation_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FieldInvestigation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AiPublicData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "generatedTitle" TEXT NOT NULL,
    "generatedStory" TEXT NOT NULL,
    "generatedCategory" TEXT NOT NULL,
    "generatedCity" TEXT,
    "generatedUrgency" TEXT NOT NULL,
    "safeMediaUrls" TEXT,
    "piiDetected" BOOLEAN NOT NULL DEFAULT false,
    "piiRemoved" TEXT,
    "mediaFlagged" TEXT,
    "confidenceScore" INTEGER NOT NULL DEFAULT 0,
    "adminEdited" BOOLEAN NOT NULL DEFAULT false,
    "adminEditedTitle" TEXT,
    "adminEditedStory" TEXT,
    "model" TEXT NOT NULL DEFAULT 'claude-sonnet-4-6',
    "tokensUsed" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AiPublicData_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "donorId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "method" TEXT NOT NULL DEFAULT 'bank_transfer',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "transactionRef" TEXT,
    "confirmedAt" DATETIME,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "donorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Donation_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DeliveryProof" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "deliveredBy" TEXT NOT NULL,
    "deliveryDate" DATETIME NOT NULL,
    "deliveryMethod" TEXT NOT NULL,
    "amountDelivered" REAL NOT NULL,
    "recipientName" TEXT,
    "deliveryNotes" TEXT,
    "photoUrls" TEXT,
    "adminConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "adminConfirmedAt" DATETIME,
    "adminNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DeliveryProof_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminId" TEXT NOT NULL,
    "caseId" TEXT,
    "action" TEXT NOT NULL,
    "notes" TEXT,
    "metadata" TEXT,
    "ipAddress" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminAuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AdminAuditLog_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "caseId" TEXT,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notification_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IdempotencyKey" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FieldInvestigation_caseId_key" ON "FieldInvestigation"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "AiPublicData_caseId_key" ON "AiPublicData"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryProof_caseId_key" ON "DeliveryProof"("caseId");

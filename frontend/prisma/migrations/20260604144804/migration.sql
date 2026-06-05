-- CreateTable
CREATE TABLE "FiscalNoteSubmission" (
    "id" TEXT NOT NULL,
    "type" "FiscalNoteType" NOT NULL,
    "cnpj" TEXT,
    "emissionDate" TIMESTAMP(3),
    "coo" TEXT,
    "amount" DECIMAL(10,2),
    "accessKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FiscalNoteSubmission_pkey" PRIMARY KEY ("id")
);

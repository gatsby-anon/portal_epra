-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ORIENTADOR', 'ALUNO_INTERNO', 'USUARIO_EXTERNO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USUARIO_EXTERNO',
    "course" TEXT,
    "isEmailConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "activationToken" TEXT,
    "activationExpires" TIMESTAMP(3),
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentTimestamp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_activationToken_idx" ON "User"("activationToken");

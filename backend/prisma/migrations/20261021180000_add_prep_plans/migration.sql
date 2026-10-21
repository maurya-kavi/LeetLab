CREATE TABLE "PrepPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "jobDescription" TEXT,
    "interviewDate" TIMESTAMP(3),
    "questionCount" INTEGER NOT NULL,
    "dailyMinutes" INTEGER,
    "difficulty" "Difficulty",
    "topics" TEXT[] NOT NULL,
    "skills" TEXT[] NOT NULL,
    "recommendations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrepPlan_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PrepPlan_userId_createdAt_idx" ON "PrepPlan"("userId", "createdAt");

ALTER TABLE "PrepPlan" ADD CONSTRAINT "PrepPlan_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Problem"
ADD COLUMN "problemNumber" SERIAL NOT NULL;

CREATE UNIQUE INDEX "Problem_problemNumber_key" ON "Problem"("problemNumber");

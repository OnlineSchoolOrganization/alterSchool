-- CreateTable
CREATE TABLE "TeacherStat" (
    "id" UUID NOT NULL,
    "teacherId" UUID NOT NULL,
    "label" VARCHAR(64) NOT NULL,
    "value" VARCHAR(64) NOT NULL,

    CONSTRAINT "TeacherStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingPlan" (
    "id" UUID NOT NULL,
    "teacherId" UUID NOT NULL,
    "type" VARCHAR(32) NOT NULL,
    "label" VARCHAR(128) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "benefits" TEXT[],

    CONSTRAINT "PricingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupPromo" (
    "id" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "badgeText" VARCHAR(64) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "oldPrice" DECIMAL(10,2),

    CONSTRAINT "GroupPromo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeacherStat_teacherId_idx" ON "TeacherStat"("teacherId");

-- CreateIndex
CREATE INDEX "PricingPlan_teacherId_idx" ON "PricingPlan"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupPromo_groupId_key" ON "GroupPromo"("groupId");

-- AddForeignKey
ALTER TABLE "TeacherStat" ADD CONSTRAINT "TeacherStat_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingPlan" ADD CONSTRAINT "PricingPlan_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupPromo" ADD CONSTRAINT "GroupPromo_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

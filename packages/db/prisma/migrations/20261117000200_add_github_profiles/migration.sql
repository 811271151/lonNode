-- CreateTable
CREATE TABLE "github_profiles" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "github_id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT NOT NULL,
    "html_url" TEXT NOT NULL,
    "bio" TEXT,
    "company" TEXT,
    "location" TEXT,
    "public_repos" INTEGER NOT NULL,
    "followers" INTEGER NOT NULL,
    "following" INTEGER NOT NULL,
    "note" VARCHAR(1000) NOT NULL DEFAULT '',
    "fetched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "github_profiles_owner_id_created_at_idx" ON "github_profiles"("owner_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "github_profiles_owner_id_github_id_key" ON "github_profiles"("owner_id", "github_id");

-- AddForeignKey
ALTER TABLE "github_profiles" ADD CONSTRAINT "github_profiles_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

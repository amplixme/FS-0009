-- AlterTable: Eliminar campos que se agregaron por error en Post
ALTER TABLE "Post" DROP COLUMN IF EXISTS "avatarURL",
DROP COLUMN IF EXISTS "bio";

-- AlterTable: Agregar campos correctos en User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bio" TEXT,
ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
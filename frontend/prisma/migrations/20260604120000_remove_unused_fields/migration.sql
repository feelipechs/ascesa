-- AlterTable: Remove homeTitle and homeSubtitle from SiteSettings
ALTER TABLE "SiteSettings" DROP COLUMN "homeTitle",
DROP COLUMN "homeSubtitle";

-- AlterTable: Remove publishedAt from Area
ALTER TABLE "Area" DROP COLUMN "publishedAt";

-- AlterTable: Remove publishedAt from TeamMember
ALTER TABLE "TeamMember" DROP COLUMN "publishedAt";

-- AlterTable: Remove publishedAt from Partner
ALTER TABLE "Partner" DROP COLUMN "publishedAt";

-- AlterTable: Remove publishedAt from Document
ALTER TABLE "Document" DROP COLUMN "publishedAt";

-- AlterTable: Remove photoUrl and publishedAt from Testimonial
ALTER TABLE "Testimonial" DROP COLUMN "photoUrl",
DROP COLUMN "publishedAt";

-- AlterTable: Remove publishedAt from Stat
ALTER TABLE "Stat" DROP COLUMN "publishedAt";

-- AlterTable: Remove publishedAt from Animal
ALTER TABLE "Animal" DROP COLUMN "publishedAt";

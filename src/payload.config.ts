import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Articles } from "./collections/Articles";
import { Authors } from "./collections/Authors";
import { CaseStudies } from "./collections/CaseStudies";
import { Faqs } from "./collections/Faqs";
import { SiteSettings } from "./collections/SiteSettings";
import { Users } from "./collections/Users";
import { Services } from "./collections/Services";
import { Testimonials } from "./collections/Testimonials";
import { Videos } from "./collections/Videos";

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Services,
    Articles,
    CaseStudies,
    Testimonials,
    Videos,
    Faqs,
    SiteSettings,
    Authors,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "fallback-secret-for-onedim-dev-only-not-for-prod",
  typescript: {
    outputFile: path.resolve(process.cwd(), "src/payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "postgres://localhost:5432/onedim",
    },
  }),
  sharp,
  plugins: [],
});

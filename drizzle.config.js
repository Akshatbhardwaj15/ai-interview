import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./utils/schema.js",
  dbCredentials:{
    url: 'postgresql://ai-interview_owner:MdRXShix0vr2@ep-lucky-violet-a5w5tq7s.us-east-2.aws.neon.tech/ai-interview?sslmode=require',
  },
});
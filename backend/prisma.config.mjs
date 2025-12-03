import dotenv from "dotenv";
import { defineConfig, env } from 'prisma/config';
dotenv.config();

export default defineConfig({
  migrations: {
      seed: 'node ./prisma/seed.mjs',
    },
  datasource: {
    url: env('DATABASE_URL'),
  },
});

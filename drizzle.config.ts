import { Config, defineConfig } from 'drizzle-kit';
// export default {
//     schema: "./src/schema.ts",
//     out: "./drizzle",
//     dialect: 'postgresql',
//     connectionString: process.env.DATABASE_URL,
//   } satisfies Config;
export default defineConfig({
//   schema: './src/db/schema.ts',
//   out: './drizzle/schema.ts',
//   out: './drizzle',
  // Output directory for generated schema
//   driver: 'pglite',
schema: './src/db/schema.ts',
out: './src/db/drizzle',
  dialect: 'postgresql', 

  dbCredentials: {
    url: process.env.DATABASE_URL,
    database: 'postgres',
    // url: './src/db/schema',
    host: "aws-0-us-east-1.pooler.supabase.com",
    port: 5432,
    user:'postgres.lxwseiihvkgnlgaqcdaz',
    password: 'admin@123',
    // database: "postgres",
  },
  schemaFilter: ['public'],
  verbose: true,
  strict: true,
})satisfies Config;;
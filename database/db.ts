import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "database/schema";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

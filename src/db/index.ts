// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";

// const client = postgres(process.env.DB_CONNECTION_STRING!);
// const db = drizzle(client);

// export default db;



import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
// import { users } from './schema'

const connectionString = process.env.DATABASE_URL!

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
const db = drizzle(client);

export default db;
// const allUsers = await db.select().from(users);
        

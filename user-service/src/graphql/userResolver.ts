import * as mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { users } from "../../drizzle/Schema.ts";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

let db: any = null;
async function getDB() {
  if (!db) {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST!,
      user: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
    });
    db = drizzle(connection);
  }
  return db;
}

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      const db = await getDB();
      const userId = context.userId;
      if (!userId) return null;

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, String(userId)));

      return user ? { id: user.id, email: user.email } : null;
    },
  },

  Mutation: {
    register: async (_: any, { email, password }: any) => {
      const db = await getDB();

      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (existing) throw new Error("User already exists");

      const hashed = await bcrypt.hash(password, 10);
      const userId = uuidv4();

      await db.insert(users).values({ id: userId, email, password: hashed });

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      return { id: user.id, email: user.email };
    },

    login: async (_: any, { email, password }: any) => {
      const db = await getDB();

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });

      return { token, user: { id: user.id, email: user.email } };
    },
  },
};

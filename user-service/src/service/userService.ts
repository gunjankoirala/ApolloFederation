import { getDB } from "../utils/db.js";
import { users } from "../../drizzle/Schema.js";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const UserService = {
  getUserById: async (id: string) => {
    const db = await getDB();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ? { id: user.id, email: user.email } : null;
  },

  getUserByEmail: async (email: string) => {
    const db = await getDB();
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  register: async (email: string, password: string) => {
    const db = await getDB();
    const existing = await UserService.getUserByEmail(email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await db.insert(users).values({
      id: userId,
      email,
      password: hashed,
    });

    return { id: userId, email };
  },

  login: async (email: string, password: string) => {
    const user = await UserService.getUserByEmail(email);
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return { token, user: { id: user.id, email: user.email } };
  },
};

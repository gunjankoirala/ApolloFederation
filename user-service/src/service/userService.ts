import { getDB } from "../utils/db.js";
import { user } from "../../drizzle/Schema.js";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const UserService = {
  getUserById: async (id: string) => {
    const db = await getDB();
    const [result] = await db.select().from(user).where(eq(user.id, id));
    return result ? { id: result.id, email: result.email } : null;
  },

  getUserByEmail: async (email: string) => {
    const db = await getDB();
    const [result] = await db.select().from(user).where(eq(user.email, email));
    return result;
  },

  register: async (email: string, password: string) => {
    const db = await getDB();
    const existing = await UserService.getUserByEmail(email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await db.insert(user).values({
      id: userId,
      email,
      password: hashed,
    });

    return { id: userId, email };
  },

  login: async (email: string, password: string) => {
    const result = await UserService.getUserByEmail(email);
    if (!result) throw new Error("User not found");

    const valid = await bcrypt.compare(password, result.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign({ userId: result.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return { token, user: { id: result.id, email: result.email } };
  },
};
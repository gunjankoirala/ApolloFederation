import { getDB } from "@Database";
import { user } from "@Schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {NotFoundError,DuplicateUserError,EmailError,PasswordError,} from "@Error";

export const UserService = {
  getUserById: async (id: string) => {
    const db = await getDB();
    const [result] = await db.select().from(user).where(eq(user.id, id));
    if (!result) throw new NotFoundError(`User with id ${id} not found`);
    return { id: result.id, email: result.email };
  },

  getUserByEmail: async (email: string) => {
    const db = await getDB();
    const [result] = await db.select().from(user).where(eq(user.email, email));
    if (!result) throw new EmailError(`No user found with email ${email}`);
    return result;
  },

  register: async (email: string, password: string) => {
    const db = await getDB();
    const existing = await UserService.getUserByEmail(email).catch(() => null);
    if (existing) throw new DuplicateUserError();

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
    const valid = await bcrypt.compare(password, result.password);
    if (!valid) throw new PasswordError();

    const token = jwt.sign({ userId: result.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return { token, user: { id: result.id, email: result.email } };
  },
};
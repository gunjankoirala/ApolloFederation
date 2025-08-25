import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { todos } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

let db: any = null;
async function getDB() {
  if (!db) {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    db = drizzle(connection);
  }
  return db;
}

const requireUser = (context: any) => {
  if (!context?.userId) throw new Error("Unauthorized");
  return context.userId;
};

export const todoResolvers = {
  Query: {
    todos: async (_: any, __: any, context: any) => {
      const db = await getDB();
      const userId = requireUser(context);
      return db.select().from(todos).where(eq(todos.userId, String(userId)));
    },
  },
  Mutation: {
    addTodo: async (_: any, { title }: { title: string }, context: any) => {
      const db = await getDB();
      const userId = requireUser(context);
      const [result]: any = await db.insert(todos).values({ title, completed: false, userId: String(userId) });
      const [todo] = await db.select().from(todos).where(eq(todos.id, result.insertId));
      return todo;
    },
    updateTodo: async (_: any, { id, title, completed }: { id: number; title?: string; completed?: boolean }, context: any) => {
      const db = await getDB();
      const userId = requireUser(context);
      const updateObj: any = {};
      if (title !== undefined) updateObj.title = title;
      if (completed !== undefined) updateObj.completed = completed;
      await db.update(todos).set(updateObj).where(and(eq(todos.id, id), eq(todos.userId, String(userId))));
      const [todo] = await db.select().from(todos).where(and(eq(todos.id, id), eq(todos.userId, String(userId))));
      return todo;
    },
    deleteTodo: async (_: any, { id }: { id: number }, context: any) => {
      const db = await getDB();
      const userId = requireUser(context);
      const [todo] = await db.select().from(todos).where(and(eq(todos.id, id), eq(todos.userId, String(userId))));
      if (!todo) return false;
      await db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, String(userId))));
      return true;
    },
  },
};

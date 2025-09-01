import { getDB } from "../utils/db";
import { todos } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const TodoService = {
  getTodos: async (userId: string) => {
    const db = await getDB();
    return db.select().from(todos).where(eq(todos.userId, userId));
  },

  addTodo: async (userId: string, title: string) => {
    const db = await getDB();
    const result = await db
      .insert(todos)
      .values({ title, completed: false, userId })
      .$returningId();

    if (!result.length || !result[0].id) {
      throw new Error("Failed to insert todo");
    }

    const [todo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, result[0].id));

    if (!todo) throw new Error("Inserted todo not found");
    return todo;
  },

  updateTodo: async (
    userId: string,
    id: number,
    data: { title?: string; completed?: boolean }
  ) => {
    const db = await getDB();
    const updateObj: any = {};
    if (data.title !== undefined) updateObj.title = data.title;
    if (data.completed !== undefined) updateObj.completed = data.completed;

    await db
      .update(todos)
      .set(updateObj)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    const [todo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    if (!todo) throw new Error("Todo not found or not authorized");
    return todo;
  },

  deleteTodo: async (userId: string, id: number) => {
    const db = await getDB();
    const [todo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    if (!todo) return false;

    await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    return true;
  },
};
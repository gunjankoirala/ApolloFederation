import { getDB } from "../utils/db";
import { todo } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const TodoService = {
  getTodos: async (userId: string) => {
    const db = await getDB();
    return db.select().from(todo).where(eq(todo.userId, userId));
  },

  addTodo: async (userId: string, title: string) => {
    const db = await getDB();
    const result = await db
      .insert(todo)
      .values({ title, completed: false, userId })
      .$returningId();

    if (!result.length || !result[0].id) {
      throw new Error("Failed to insert todo");
    }

    const [todoItem] = await db
      .select()
      .from(todo)
      .where(eq(todo.id, result[0].id));

    if (!todoItem) throw new Error("Inserted todo not found");
    return todoItem;
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
      .update(todo)
      .set(updateObj)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)));

    const [updatedTodo] = await db
      .select()
      .from(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)));

    if (!updatedTodo) throw new Error("Todo not found or not authorized");
    return updatedTodo;
  },

  deleteTodo: async (userId: string, id: number) => {
    const db = await getDB();
    const [todoItem] = await db
      .select()
      .from(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)));

    if (!todoItem) return false;

    await db
      .delete(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)));

    return true;
  },
};
import { getDB } from "../utils/db";
import { todo } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import {NotFoundError,FailedUpdateError,DeleteFailedError,UnAuthorizedError,} from "../utils/error";

export const TodoService = {
  getTodos: async (userId: string) => {
    if (!userId) throw new UnAuthorizedError();

    const db = await getDB();
    const todos = await db.select().from(todo).where(eq(todo.userId, userId));

    if (!todos.length) {
      throw new NotFoundError("You have not yet added any todos");
    }
    return todos;
  },

  addTodo: async (userId: string, title: string) => {
    if (!userId) throw new UnAuthorizedError("Please provide Authentication token");

    const db = await getDB();
    const result = await db
      .insert(todo)
      .values({ title, completed: false, userId })
      .$returningId();

    if (!result.length || !result[0].id) {
      throw new FailedUpdateError("Failed to add todo");
    }

    const [todoItem] = await db
      .select()
      .from(todo)
      .where(eq(todo.id, result[0].id));

    if (!todoItem) {
      throw new NotFoundError("Inserted todo not found");
    }

    return todoItem;
  },

  updateTodo: async (
    userId: string,
    id: number,
    data: { title?: string; completed?: boolean }
  ) => {
    if (!userId) throw new UnAuthorizedError();

    const db = await getDB();

    const updateObj: any = {};
    if (data.title !== undefined) updateObj.title = data.title;
    if (data.completed !== undefined) updateObj.completed = data.completed;

    const updated = await db
      .update(todo)
      .set(updateObj)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)));

    if (!updated) {
      throw new FailedUpdateError("Failed to update todo");
    }

    const [updatedTodo] = await db
      .select()
      .from(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)));

    if (!updatedTodo) {
      throw new NotFoundError("Updated todo not found");
    }

    return updatedTodo;
  },

  deleteTodo: async (userId: string, id: number) => {
    if (!userId) throw new UnAuthorizedError();

    const db = await getDB();
    const [todoItem] = await db
      .select()
      .from(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)));

    if (!todoItem) {
      throw new NotFoundError("Todo to be deleted not found");
    }

    const deleted = await db
      .delete(todo)
      .where(and(eq(todo.id, id), eq(todo.userId, userId)));

    if (!deleted) {
      throw new DeleteFailedError("Failed to delete todo");
    }

    return true;
  },
};
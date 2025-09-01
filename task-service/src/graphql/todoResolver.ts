import { TodoService } from "../service/todoService";

const requireUser = (context: any) => {
  if (!context?.userId) throw new Error("Unauthorized");
  return context.userId;
};

export const todoResolvers = {
  Query: {
    todos: async (_: any, __: any, context: any) => {
      const userId = requireUser(context);
      return TodoService.getTodos(userId);
    },
  },

  Mutation: {
    addTodo: async (_: any, { title }: { title: string }, context: any) => {
      const userId = requireUser(context);
      return TodoService.addTodo(userId, title);
    },

    updateTodo: async (
      _: any,
      { id, title, completed }: { id: number; title?: string; completed?: boolean },
      context: any
    ) => {
      const userId = requireUser(context);
      return TodoService.updateTodo(userId, id, { title, completed });
    },

    deleteTodo: async (_: any, { id }: { id: number }, context: any) => {
      const userId = requireUser(context);
      return TodoService.deleteTodo(userId, id);
    },
  },
};
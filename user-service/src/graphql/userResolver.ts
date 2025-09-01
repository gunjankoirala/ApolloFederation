import { UserService } from "../service/userService.ts";

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      const userId = context.userId;
      if (!userId) return null;
      return UserService.getUserById(userId);
    },
  },

  Mutation: {
    register: async (_: any, { email, password }: any) => {
      return UserService.register(email, password);
    },

    login: async (_: any, { email, password }: any) => {
      return UserService.login(email, password);
    },
  },
};

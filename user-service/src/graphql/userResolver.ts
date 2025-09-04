import { UserService } from "@Service/userService";
import {UnAuthorizedError} from "@Error";

export const userResolvers = {
  Query: {
  me: async (_: any, __: any, context: any) => {
  const userId = context.userId;
  if (!userId) throw new UnAuthorizedError("You must be logged in to view your profile");

  return UserService.getUserById(userId);
    }
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
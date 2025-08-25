import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { userResolvers } from "./graphql/userResolver.ts";
import { userSchema } from "./graphql/userSchema.ts";
import { buildSubgraphSchema } from "@apollo/subgraph";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

(async () => {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs: userSchema, resolvers: userResolvers }]),
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT!) || 4001 },
    context: async ({ req }) => {
      const authHeader = req.headers.authorization ?? "";
      if (!authHeader) return {};

      const token = authHeader.replace(/^Bearer\s+/i, "").trim();
      try {
        const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
        return { userId: payload.userId };
      } catch (err: any) {
        console.error("JWT verification failed in User Service:", err.message);
        return {};
      }
    },
  });

  console.log(`🚀 User Service running at ${url}`);
})();


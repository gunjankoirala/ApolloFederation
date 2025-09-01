import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import * as dotenv from "dotenv";
import { todoSchema } from "./graphql/todoSchema";
import { todoResolvers } from "./graphql/todoResolver";
import jwt from "jsonwebtoken";

dotenv.config();

const schema = buildSubgraphSchema({
  typeDefs: todoSchema,
  resolvers: todoResolvers,
});

const server = new ApolloServer({ schema });

const port = process.env.PORT || 4002;

startStandaloneServer(server, {
  listen: { port: Number(port) },
  context: async ({ req }) => {
    const authHeader = req.headers.authorization ?? "";
    if (!authHeader) return {};

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    try {
      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
      return { userId: payload.userId };
    } catch (err: any) {
      console.error("JWT verification failed in Todo Service:", err.message);
      return {};
    }
  },
}).then(({ url }) => console.log(`Todo Service running at ${url}`));
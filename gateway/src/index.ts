import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloGateway, RemoteGraphQLDataSource, IntrospectAndCompose } from "@apollo/gateway";
import * as dotenv from "dotenv";

dotenv.config();

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "user", url: "http://localhost:4001/graphql" },
      { name: "todo", url: "http://localhost:4002/graphql" },
    ],
  }),
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }: any) {
        if (context?.authHeader) {
          request.http?.headers.set("authorization", context.authHeader);
        }
      },
    });
  },
});

const server = new ApolloServer({ gateway, introspection: true });

startStandaloneServer(server, {
  listen: { port: Number(process.env.PORT ?? 4000) },
  context: async ({ req }) => {
    const authHeader = req.headers.authorization ?? "";
    return { authHeader };
  },
}).then(({ url }) => console.log(` Gateway running at ${url}`));

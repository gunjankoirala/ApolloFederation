import { gql } from "graphql-tag";

export const userSchema = gql`
  type User @key(fields: "id") {
  id: ID!
  email: String!
}

type AuthPayload {
  token: String!
  user: User!
}

type Query {
  me: User
}

type Mutation {
  register(email: String!, password: String!): User!
  login(email: String!, password: String!): AuthPayload!
}

`;

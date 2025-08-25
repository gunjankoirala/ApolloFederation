import { gql } from "graphql-tag";

export const todoSchema = gql`
  type Todo @key(fields: "id") {
    id: Int!
    title: String!
    completed: Boolean!
    userId: String!
  }

  type Query {
    todos: [Todo!]!
  }

  type Mutation {
    addTodo(title: String!): Todo!
    updateTodo(id: Int!, title: String, completed: Boolean): Todo!
    deleteTodo(id: Int!): Boolean!
  }
`;


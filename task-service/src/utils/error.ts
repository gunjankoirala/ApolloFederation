import { GraphQLError } from "graphql";

export class NotFoundError extends GraphQLError {
  constructor(message: string = "todo not found") {
    super(message, { extensions: { code: "NOT_FOUND" } });
  }
}

export class UnAuthorizedError extends GraphQLError {
  constructor(message: string = "Unauthorized access") {
    super(message, { extensions: { code: "UNAUTHORIZED" } });
  }
}

export class FailedUpdateError extends GraphQLError {
  constructor(message: string = "Failed to update todo") {
    super(message, { extensions: { code: "UPDATE_FAILED" } });
  }
}

export class DeleteFailedError extends GraphQLError {
  constructor(message: string = "Failed to delete todo") {
    super(message, { extensions: { code: "DELETE_FAILED" } });
  }
}
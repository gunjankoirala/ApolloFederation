import { GraphQLError } from "graphql";

export class NotFoundError extends GraphQLError {
  constructor(message: string = "User not found") {
    super(message, { extensions: { code: "NOT_FOUND" } });
  }
}

export class DuplicateUserError extends GraphQLError {
  constructor(message: string = "User already Exists") {
    super(message, { extensions: { code: "User_Exists" } });
  }
}

export class EmailError extends GraphQLError {
  constructor(message: string = "Wrong Email, PLease use correct Credentials") {
    super(message, { extensions: { code: "Wrong_Email" } });
  }
}
export class PasswordError extends GraphQLError {
  constructor(message: string = "Wrong Password, Please use correct password") {
    super(message, { extensions: { code: "Wrong_Password" } });
  }
}

export class AuthTokenError extends GraphQLError {
  constructor(message: string = "Invalid or expired token") {
    super(message, { extensions: { code: "AUTH_TOKEN_ERROR" } });
  }
}

export class UnAuthorizedError extends GraphQLError {
  constructor(message: string = "Unauthorized access") {
    super(message, { extensions: { code: "UNAUTHORIZED" } });
  }
}
"use strict";

import { StatusCode } from "../configs/StatusCode.js";
import { ReasonPhrase } from "../configs/reasonPhrases.js";

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.now = Date.now();
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrase.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}
// error client data
class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrase.BAD_REQUEST,
    statusCode = StatusCode.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}
//
class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrase.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrase.NOT_FOUND,
    statusCode = StatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonPhrase.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}
class RedisErrorResponse extends ErrorResponse {
  constructor(
    message = ReasonPhrase.INTERNAL_SERVER_ERROR,
    statusCode = StatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode);
  }
}
export {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
  RedisErrorResponse,
  ErrorResponse,
};

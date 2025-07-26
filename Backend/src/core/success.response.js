"use strict";
import { StatusCode } from "../configs/StatusCode.js";
import { ReasonPhrase } from "../configs/reasonPhrases.js";
class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonPhrase = ReasonPhrase.OK,
    success = true,
    data = {},
  }) {
    this.success = success;
    this.message = !message ? reasonPhrase : message;
    this.status = statusCode;
    this.data = data;
  }
  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}
class Ok extends SuccessResponse {
  constructor({ message, data }) {
    super({
      message,
      data,
    });
  }
}
class Created extends SuccessResponse {
  constructor({
    options = {},
    message,
    statusCode = StatusCode.CREATED,
    reasonPhrase = ReasonPhrase.CREATED,
    data,
  }) {
    super({
      message,
      statusCode,
      reasonPhrase,
      data,
    });
    this.options = options;
  }
}

export { Ok, Created, SuccessResponse };

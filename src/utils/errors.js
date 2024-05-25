class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 404;
  }
}

class InternalServerError extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 500;
  }
}

export {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
};

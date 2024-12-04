class Response {
  constructor(success, message, data = null) {
    this.success = success;
    this.message = message;
    if (data !== null) {
      this.data = data;
    }
  }

  static success(res, message = "Success", data = null, status = 200) {
    return res.status(status).json(new Response(true, message, data));
  }

  static error(res, message = "Error", errors = null, status = 400) {
    const response = new Response(false, message);
    if (errors) {
      response.errors = errors;
    }
    return res.status(status).json(response);
  }

  static unauthorized(res, message = "Unauthorized") {
    return this.error(res, message, null, 401);
  }

  static forbidden(res, message = "Forbidden") {
    return this.error(res, message, null, 403);
  }

  static notFound(res, message = "Not Found") {
    return this.error(res, message, null, 404);
  }

  static serverError(res, message = "Internal Server Error", error = null) {
    const response = new Response(false, message);
    if (process.env.NODE_ENV !== "production" && error) {
      response.stack = error.stack;
    }
    return res.status(error.status || 500).json(response);
  }
}

module.exports = Response;

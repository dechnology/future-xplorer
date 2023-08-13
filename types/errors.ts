export class NoTokenError extends Error {
  static get code(): 'NO_TOKEN_ERROR' {
    return 'NO_TOKEN_ERROR';
  }

  code: string;

  constructor(message: string = 'No token provided.') {
    super(message);
    this.name = 'NoTokenError';
    this.code = NoTokenError.code;
  }
}

export class UncaughtError extends Error {
  static get code(): 'UNCAUGHT_ERROR' {
    return 'UNCAUGHT_ERROR';
  }

  code: string;

  constructor(message: string = 'Error not caught.') {
    super(message);
    this.name = 'UncaughtError';
    this.code = UncaughtError.code;
  }
}

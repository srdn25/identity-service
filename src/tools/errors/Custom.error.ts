export class CustomError extends Error {
  status: number;
  reason: string[] | object | string;
  data: object;
  constructor(error) {
    super(error.message);
    this.status = error.status;
    this.reason = error.reason;
    this.message = error.message;
    this.data = error.data;
  }

  serialize() {
    return {
      message: this.message,
      reason: this.reason,
      status: this.status,
    };
  }
}

export default abstract class CustomError extends Error {
  protected statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
  getStatusCode(): number {
    return this.statusCode;
  }
}

import CustomError from "./CustomError";

export default class UnauthorizedException extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

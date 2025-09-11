import CustomError from "./CustomError";

export default class NotFoundException extends CustomError {
  constructor(message: string) {
    super(message, 404);
  }
}

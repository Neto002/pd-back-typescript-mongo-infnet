import CustomError from "./CustomError";

export default class DataValidationException extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

import CustomError from "./CustomError";

export default class NoDataProvidedException extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

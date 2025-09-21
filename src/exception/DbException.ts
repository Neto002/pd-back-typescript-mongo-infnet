import CustomError from "./CustomError";

export default class DbException extends CustomError {
  constructor(message: string) {
    super(message, 500);
    console.error("Bd Error: ", super.message);
  }
}

import { NextFunction, Request, Response } from "express";
import CustomError from "../exception/CustomError";

const exceptionHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof CustomError) {
    return res
      .status(err.getStatusCode())
      .json({ error: err.message, status: err.getStatusCode() });
  }

  return res.status(500).json({ error: "Internal server error", status: 500 });
};

export default exceptionHandler;

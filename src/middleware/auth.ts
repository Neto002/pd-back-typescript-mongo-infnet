import { Request, Response, NextFunction } from "express";
import UnauthorizedException from "../exception/UnauthorizedException";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["api-key"];
  if (apiKey) {
    if (apiKey === "chaveSuperSecreta") {
      next();
      return;
    }
  }
  throw new UnauthorizedException("Invalid or missing API key");
};

export default auth;

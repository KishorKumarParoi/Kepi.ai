// Register a new user

import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../packages/error-handler";
import { validateRegistrationData } from "../utils/auth.helper";

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validateRegistrationData(req.body, "user");
  const { name, email } = req.body;

  const existingUser = await prismadb.users.findUnique({ where: email });
  if (existingUser) {
    return next(new ValidationError("User Already exists with this email!"));
  }
};

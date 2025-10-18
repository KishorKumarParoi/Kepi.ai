/**
 * At first checking user registration data
 * validate the form data
 * check if user exists or not
 * if not exist create new user
 * (Check OTP Restriction)
 */

// Register a new user

import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../packages/error-handler";
import { checkOtpRestrictions, sendOtp, trackOtpRequests, validateRegistrationData } from "../utils/auth.helper";

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");

    const { name, email } = req.body;
    console.log("name", name);

    const existingUser = await prismadb.users.findUnique({ where: email });
    if (existingUser) {
      return next(new ValidationError("User already exists with this email!"));
    }

    // otp
    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(name, email, 'user-activation-mail')

    res.status(200).json({
      status: "success",
      message: "OTP sent to your email for verification.",
    });
  } catch (error) {
    return next(error);
  }
};

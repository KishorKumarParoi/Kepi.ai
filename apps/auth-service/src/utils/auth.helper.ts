import { NextFunction } from 'express';
import { ValidationError } from "../../../../packages/error-handler";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError(`Missing required Fields!`);
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid Email Format!");
  }
};

export const checkOtpRestrictions = (email: string, next: NextFunction) => { }

export const sendOtp = async (name: string, email: string, template: string) => {
  // const otp = crypto.randomInt(1000, 9999).toString();
}


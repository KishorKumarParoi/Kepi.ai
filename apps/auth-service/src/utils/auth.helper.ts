import crypto from "crypto";
import { NextFunction } from 'express';
import { ValidationError } from "../../../../packages/error-handler";
import redis from "../../../../packages/libs/redis";
import { sendEmail } from "./sendMail";

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

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(new ValidationError("Too many OTP requests. Please try again later after 30 minutes."));
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(new ValidationError("Too many OTP requests. Please try again later after 1 hour."));
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(new ValidationError("Please wait 1 minute before requesting another OTP."));
  }
}

export const sendOtp = async (name: string, email: string, template: string) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify Your Email", template, { name, otp });

  await redis.set(`otp:${email}`, otp, { EX: 5 * 60 }); // OTP valid for 5 minutes
  await redis.set(`otp_cooldown:${email}`, '1', { EX: 60 }); // 1 minute cooldown
}


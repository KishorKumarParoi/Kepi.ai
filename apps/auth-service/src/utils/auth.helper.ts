import crypto from "crypto";
import { NextFunction, Request, Response } from 'express';
import { sendEmail } from "./sendMail";
import { ValidationError } from "../../../../packages/error-handler";
import { getRedis } from "../../../../packages/libs/redis";
import { fail } from "assert";

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

export const trackOtpRequests = async (email: string, next: NextFunction) => {
  const redis = await getRedis();

  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", { EX: 60 * 60 }); // 1 hour lock
    return next(new ValidationError("Frequent Requests. Please try again later after 1 hour."));
  }

  await redis.set(otpRequestKey, (otpRequests + 1).toString(), { EX: 60 * 60 });
}

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
  const redis = await getRedis();

  if (await redis.get(`otp_lock:${email}`)) {
    return next(new ValidationError("Please try again later after 30 minutes."));
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(new ValidationError("Too many OTP requests. Please try again later after 1 hour."));
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(new ValidationError("Please wait 1 minute before requesting another OTP."));
  }
}

export const sendOtp = async (name: string, email: string, template: string) => {
  const redis = await getRedis();
  const otp = crypto.randomInt(100000, 999999).toString();

  console.log(`📧 Sending OTP to: ${email}`);
  await sendEmail(email, "Verify Your Email", template, { name, otp });

  await redis.set(`otp:${email}`, otp, { EX: 5 * 60 }); // OTP valid for 5 minutes
  await redis.set(`otp_cooldown:${email}`, "true", { EX: 60 }); // 1 minute cooldown

  const storedOtp = await redis.get(`otp:${email}`);
  console.log(`✅ OTP stored in Redis for ${email}: ${storedOtp}`);
  console.log(`🔑 Generated OTP: ${otp}`);
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const verifyOtp = async (email: string, otp: string, next: NextFunction) => {
  const redis = await getRedis();
  const storedOtp = await redis.get(`otp:${email}`);

  if (!storedOtp) {
    return next(new ValidationError("OTP has expired. Please request a new one."));
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", { EX: 30 * 60 }); // 30 minutes lock
      await redis.del([`otp:${email}`, failedAttemptsKey]);
      return next(new ValidationError("Too many incorrect attempts. OTP locked for 30 minutes."));
    }

    await redis.set(failedAttemptsKey, (failedAttempts + 1), { EX: 5 * 60 });
    return next(
      new ValidationError(`Incorrect OTP. ${2 - failedAttempts} attempts left.`)
    )
  }

  await redis.del([`otp:${email}`, failedAttemptsKey]);
}

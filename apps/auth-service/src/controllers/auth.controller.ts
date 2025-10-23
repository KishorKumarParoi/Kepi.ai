import { prismadb } from './../../../../packages/libs/prisma/index';
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../packages/error-handler";
import { checkOtpRestrictions, sendOtp, trackOtpRequests, validateRegistrationData, verifyOtp } from "../utils/auth.helper";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { setCookie } from '../utils/cookies/setCookies';

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");

    const { name, email } = req.body;

    const existingUser = await prismadb.users.findUnique({
      where: {
        email
      }
    });

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


// verify user with otp
export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, password, name } = req.body;
    if (!email || !otp || !password || !name) {
      return next(new ValidationError("Missing required fields!"));
    }

    const existingUser = await prismadb.users.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return next(new ValidationError("User already exists with this email!"));
    }

    await verifyOtp(email, otp, next);

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);
    await prismadb.users.create({
      data: {
        name, email, password: hashedPassword, following: [],
      }
    })

    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
    });

  } catch (error) {
    return next(error);
  }
}


// log in user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError("Missing required fields!"));
    }

    const existingUser = await prismadb.users.findUnique({
      where: {
        email
      }
    });

    if (!existingUser) {
      return next(new ValidationError("No user found with this email!"));
    }

    // verify password
    const isPasswordMatched = await bcrypt.compare(password, existingUser.password!);
    if (!isPasswordMatched) {
      return next(new ValidationError("Incorrect password!"));
    }

    // generate access token and refresh token
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET_KEY;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET_KEY;

    if (!accessTokenSecret || !refreshTokenSecret) {
      return next(new ValidationError("Server configuration error: Missing token secrets"));
    }

    const accessToken = jwt.sign(
      { id: existingUser.id, role: "user" },
      accessTokenSecret,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { id: existingUser.id, role: "user" },
      refreshTokenSecret,
      { expiresIn: '7d' }
    )

    // store the refresh token and access token in an HTTP-only cookie
    setCookie(res, 'accessToken', accessToken);
    setCookie(res, 'refreshToken', refreshToken);

    res.status(200).json({
      message: "User logged in successfully.",
      status: "success",
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
      }
    })

  } catch (error) {
    return next(error);
  }
}

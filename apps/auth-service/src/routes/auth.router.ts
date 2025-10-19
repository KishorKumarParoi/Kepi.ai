import { asyncHandler } from './../utils/auth.helper';
import express, { Router } from "express";
import { userRegistration } from "../controllers/auth.controller";


const router: Router = express.Router();

router.post("/user-registration", asyncHandler(userRegistration))

export default router;

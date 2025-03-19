import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError, encryptPassword, isPasswordMatch } from "../utils";
import config from "../config/config";

const jwtSecret = config.JWT_SECRET as string;
const COOKIE_EXPIRATION_DAYS = 90; // cookie expiration in days
const expirationDate = new Date(
    Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
);
const cookieOptions = {
    expires: expirationDate,
    secure: false,
    httpOnly: true,
};

const register = async (req: Request, res: Response) => {
    
};

export default {
    register,
};
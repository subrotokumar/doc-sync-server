import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler";
import { Request, NextFunction, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";

export interface AuthorizedRequest extends Request {
    user: any
}

export const authMiddleware = asyncHandler(
    async (req: AuthorizedRequest, _: Response, next: NextFunction,) => {
        try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.split(' ')[1]
            if (!token) {
                throw new ApiError(401, "Unauthorized Request")
            }

            const decordedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
                if (err) throw new ApiError(401, "Invalid Access token")
                return user
            })
            //@ts-ignore
            const user = await User.findById(decordedToken._id).select("-password -refresh")
            if (!user) {
                throw new ApiError(401, "Invalid Access Token")
            }
            req.user = user;
            next()
        } catch (error) {
            if (typeof error === "string") {
                throw new ApiError(401, error ?? "Invalid Access Token")
            } else if (error instanceof Error) {
                throw new ApiError(401, error?.message || "Invalid Access Token")
            }

        }
    }
)
import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { CookieOptions, Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { User } from "../../models/user.model";
import { AuthorizedRequest } from "../../middlewares/auth.middleware";
import jwt from "jsonwebtoken"

type RegisterRequestBody = {
    username: string
    avatar: string
    email: string
    password: string
}

type loginRequestBody = {
    username?: string
    email?: string
    password: string
}

/**
 * Generates new access and refresh tokens for the user with the given ID.
 * 
 * Looks up the user by ID, generates new JWT access and refresh tokens for them, 
 * saves the refresh token to the user document, and returns the tokens.
 * 
 * Throws ApiError if user lookup fails or token generation fails.
 */
const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(500, "User not found");
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refresh = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (e) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exist
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { username, email, password, avatar } = req.body as RegisterRequestBody;

    if (
        [email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refresh -__v"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    // req body => data
    // username or password
    // find the user
    // password check
    // access and refresh token
    // access and refresh token
    // send cookie

    const { email, username, password } = req.body as loginRequestBody
    if (!username && !email) {
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id.toString())

    const option: CookieOptions = {
        httpOnly: true,
        secure: true,
    }

    const loggedInUser = {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        accessToken: accessToken,
        refreshToken: refreshToken,
    }

    res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(new ApiResponse(
            200,
            loggedInUser,
            "User Logged In Successfully"
        ))
})

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refresh
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request")
    }

    const decordedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, data: any) => {
        if (err) throw new ApiError(401, "Invalid refresh token")
        return data;
    })

    //@ts-ignore
    const user = await User.findById(decordedToken?._id)
    if (!user) {
        throw new ApiError(401, "Invalid refresh token")
    }
    if (incomingRefreshToken !== user?.refresh) {
        throw new ApiError(401, "Refresh token is expired or used")
    }
    const options = {
        httpOnly: true,
        secure: true
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id.toString())
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: refreshToken },
                "Access token refreshed"
            )
        );
})


export const logoutUser = asyncHandler(async (req: AuthorizedRequest, res: Response) => {
    const userId = req.user._id;
    const t = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { refresh: null } },
        { new: true }
    )
    const option: CookieOptions = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, "logout success", "User successfully logged out"))
})


export const userData = asyncHandler(async (req: AuthorizedRequest, res: Response) => {
    const userId = req.user._id;
    const userData = await User.findById(userId).select("-password -refresh -__v")
    if (!userData) {
        throw new ApiError(404, "No user found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, userData, "User successfully logged out"))
})

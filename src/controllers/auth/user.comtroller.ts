import { ApiResponse } from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { User } from "../../models/user.model";

type RegisterRequestBody = {
    username: string
    profilePic: string
    email: string
    password: string
}

type loginRequestBody = {
    username?: string
    email?: string
    password: string
}

const generateAccessAndRefreshToken = async (userId: string){
    try {
        const user = await User.findById(userId)
        if (!user)
            throw new ApiError(500, "Something went wrong while generating refresh and access token")
        const accessToken = user!.generateAccessToken();
        const refreshToken = user!.generateRefreshToken();
        user?.refresh
    } catch (e) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }

}

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    // get user details from frontend
    const { username, profilePic, email, password } = req.body as RegisterRequestBody;
    // validation - not empty

    // check if user already exist
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object
    //remove password and refresh token field from response
    //check for user creation
    res.status(200).json(new ApiResponse(200, "ok", ""))
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
        $or: [{ username, email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)
})


export const refreshToken = asyncHandler(async (req: Request, res: Response) => { })
import { Model, Schema, model } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Token } from "yaml/dist/parse/cst";

interface IUser {
    username: string;
    email: string;
    password: string;
    avatar: string;
    refresh?: string;
}

interface IUserModels {
    isPasswordCorrect(password: string): boolean
    generateAccessToken(): Promise<string>
    generateRefreshToken(): Promise<string>
}

type UserModel = Model<IUser, {}, IUserModels>

const userSchema = new Schema<IUser, UserModel, IUserModels>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    avatar: {
        type: String,
        required: false,
        default: "https://via.placeholder.com/100x100.png"
    },
    refresh: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
}, {
    collection: 'users',
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.method('isPasswordCorrect', async function (password: string) {
    return await bcrypt.compare(password, this.password)
})

userSchema.method('generateAccessToken', function () {
    return jwt.sign(
        { _id: this._id, username: this.username },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
})

userSchema.method('generateRefreshToken', function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
})

export const User = model("User", userSchema)
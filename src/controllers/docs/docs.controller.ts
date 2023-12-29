import { asyncHandler } from "../../utils/asyncHandler";
import { Document } from "../../models/document.model";
import { AuthorizedRequest } from "../../middlewares/auth.middleware";
import { ApiResponse } from "../../utils/ApiResponse";
import { ApiError } from "../../utils/ApiError";
import { Response } from "express";

export const updateDocumentTitle = asyncHandler(async (req: AuthorizedRequest, res: Response) => {
    const { id, title } = req.body;
    let document = await Document.findOneAndUpdate(
        {
            createdBy: req.user._id,
            _id: id
        },
        { title }
    );
    if (!document) {
        throw new ApiError(401, "No such document found")
    }

    res.status(200).json(new ApiResponse(200, document, "Document title changed successfully"))
})


export const getDocumentById = asyncHandler(async (req: AuthorizedRequest, res: Response) => {
    const { id } = req.params;
    let document = await Document.findOne(
        {
            createdBy: req.user._id,
            _id: id
        },
    );
    if (!document) {
        throw new ApiError(401, "No such document found")
    }

    res.status(200).json(new ApiResponse(200, document, "Success"))
})
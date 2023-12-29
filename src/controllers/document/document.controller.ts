import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { Document } from "../../models/document.model";
import { AuthorizedRequest } from "../../middlewares/auth.middleware";
import { ApiResponse } from "../../utils/ApiResponse";

export const createDocument = asyncHandler(async (req: AuthorizedRequest, res: Response) => {
    let document = new Document({
        title: "Untitled Document",
        createdBy: req.user._id,
    });

    document = await document.save()

    res.status(200).json(
        new ApiResponse(200, document, "Document Created")
    )
})

export const getDocumentList = asyncHandler(async (req: AuthorizedRequest, res: Response) => {
    let documentList = await Document.find({ createdBy: req.user._id }).select("-content")
    res.json(new ApiResponse(200, { docs: documentList }, "Retrieved all the document created by you"))
})
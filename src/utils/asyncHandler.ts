import { Request, Response, NextFunction } from "express"
import { ApiError } from "./ApiError"
// import { logger } from "../logger"

const asyncHandler = (requestHandler: CallableFunction) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((error) => {
                if (typeof error === 'string') {
                    // logger.error({
                    //     statusCode: 500,
                    //     success: false,
                    //     message: error
                    // })
                    res.status(500).json({
                        statusCode: 500,
                        success: false,
                        message: error
                    })
                } else if (error instanceof ApiError) {
                    // logger.error({
                    //     statusCode: error.statusCode,
                    //     success: false,
                    //     message: error.message
                    // })
                    res.status(error.statusCode).json({
                        statusCode: error.statusCode,
                        success: false,
                        message: error.message
                    })
                }
            })
    }
}

// const asyncHandler = (fn: CallableFunction) => async (req: Response, res: Response, next: NextFunction) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         if (typeof error === 'string') {
//             res.status(500).json({
//                 success: false,
//                 message: error
//             })
//         } else if (error instanceof ApiError) {
//             res.status(error.statusCode).json({
//                 success: false,
//                 message: error.message
//             })
//         }
//     }
// }

export { asyncHandler }
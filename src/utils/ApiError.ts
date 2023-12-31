class ApiError extends Error {
    statusCode: number
    message: string
    errors: Array<any>
    stack: string
    success: boolean

    constructor(
        statusCode: number,
        message: string,
        error?: any,
        stack?: string
    ) {
        super(message)
        this.success = false
        this.statusCode = statusCode;
        this.message = message;
        this.errors = error;
        this.stack = "";
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError }
class ApiResponse {
    statusCode: number
    data: Object
    message: string
    success: boolean
    constructor(statusCode: number, data: Object, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };

const a = new ApiResponse(200, "", "")
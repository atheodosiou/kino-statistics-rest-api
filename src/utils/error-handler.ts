import { Request, Response, NextFunction } from 'express';

const errorHandler = function (req: Request, resp: Response, next: NextFunction, errorMessage?: string, statusCode?: number) {
    const response: any = { error: 'Internal Server Error', statusCode: 500 };
    if (statusCode) response.statusCode = statusCode;
    if (errorMessage) response.error = errorMessage;
    return resp.status(response.statusCode || 500).json(response);
}

export { errorHandler };
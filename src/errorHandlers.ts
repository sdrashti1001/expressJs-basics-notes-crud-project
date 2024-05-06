import { Response } from 'express';

export const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 401
};

// Helper function to handle 404 errors
export const handleNotFound = (res: Response, message = 'Not Found') => {
    return res.status(404).json({ message });
};

export const handleError = (res: Response, error: Error, status = 500) => {
    console.error('Error:', error);
    return res.status(status).json({ message: 'Internal Server Error' });
};

// Helper function to send success response
export const sendResponse = (res: Response, data: any, status = 200) => {
    return res.status(status).json(data);
};

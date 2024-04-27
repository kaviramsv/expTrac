import { INTERNAL_SERVER_ERROR } from 'http-status';

/**
 * @extends Error
 */
class ExtendableError extends Error {
    statusCode: any;
    isPublic: boolean;
    status: string | null;
    isOperational: boolean;

    constructor(
        message: string,
        statusCode: any,
        isPublic: boolean,
        status: string | null
    ) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.statusCode = statusCode;
        this.isPublic = isPublic;
        this.status = status;
        this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */

export class APIError extends ExtendableError {
    /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {any} statusCode - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     * @param {string | null} status - HTTP status code of error.
     */
    constructor(
        message = 'INTERNAL_SERVER_ERROR',
        statusCode = 500,
        isPublic = false,
        status = null
    ) {
        super(message, statusCode, isPublic, status);
    }
}

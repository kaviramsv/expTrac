import { BAD_REQUEST, FORBIDDEN, NOT_FOUND } from 'http-status';

import { RespBodyInterface } from '../enums/responseBody';

export const badRequest = (message: string): RespBodyInterface => ({
    message,
    success: false,
    isPublic: true,
    statusCode: BAD_REQUEST,
});

export const notFound = (message: string): RespBodyInterface => ({
    message,
    success: false,
    isPublic: true,
    statusCode: NOT_FOUND,
});

export const forbidden = (message: string): RespBodyInterface => ({
    message,
    success: false,
    isPublic: true,
    statusCode: FORBIDDEN,
});

export const errorMessage = {
    invalidDevice: 'Device not found.',
    invalidUser: 'User does not exist.',
    invalidContact: 'Contact does not exist.',
    invalidAnomaly: 'Anomaly ID does not exist.',
};

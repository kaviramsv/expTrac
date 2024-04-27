import express from 'express';
import { validate } from 'express-validation';
import { verifyJwt } from '../../middleware/verifyJwt';
import { deviceTelemetryHistoryController } from './deviceTelemetryHistory.controllers';
import { deviceTelemetryHistoryValidators } from './deviceTelemetryHistory.validation';

export const deviceTelemetryHistoryRouter = express.Router();
deviceTelemetryHistoryRouter
    .route('/')
    .post(
        [
            verifyJwt,
            validate(deviceTelemetryHistoryValidators.getTelemetryHistory),
        ],
        deviceTelemetryHistoryController.getdeviceTelemetryHistory
    );

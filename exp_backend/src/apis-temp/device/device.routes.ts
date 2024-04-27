import express from 'express';
import { validate } from 'express-validation';
import { verifyJwt } from '../../middleware/verifyJwt';
import { deviceController } from './device.controllers';
import { deviceValidators } from './device.validation';

export const deviceRouter = express.Router();

deviceRouter.route('/').get([verifyJwt], deviceController.getDevices);
deviceRouter
    .route('/:deviceID')
    .get(
        [verifyJwt, validate(deviceValidators.getDevice)],
        deviceController.getDevice
    );
deviceRouter
    .route('/telemetry/:deviceID')
    .get(
        [verifyJwt, validate(deviceValidators.getDevice)],
        deviceController.getDeviceLastTelemetry
    );
deviceRouter
    .route('/sensors/:deviceID')
    .get(
        [verifyJwt, validate(deviceValidators.getDevice)],
        deviceController.getUniqueSensorsforDevice
    );

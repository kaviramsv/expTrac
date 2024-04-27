import express from 'express';
import { validate } from 'express-validation';
import { verifyJwt } from '../../middleware/verifyJwt';
import { dynamicThresholdHistoryController } from './dynamicThresholdHistory.controllers';
import { thresholdValidators } from './dynamicThresholdHistory.validation';

export const dynamicThresholdHistoryRouter = express.Router();
dynamicThresholdHistoryRouter
    .route('/')
    .post(
        [verifyJwt, validate(thresholdValidators.getDevice)],
        dynamicThresholdHistoryController.getDeviceDynamicThresholdHistory
    );

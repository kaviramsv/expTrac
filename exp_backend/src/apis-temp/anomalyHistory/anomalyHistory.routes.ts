import express from 'express';
import { validate } from 'express-validation';
import { anomalyHistoryController } from './anomalyHistory.controllers';
import { anomalyHistoryValidators } from './anomalyHistory.validation';
import { verifyJwt } from '../../middleware/verifyJwt';
export const anomalyHistoryRouter = express.Router();

anomalyHistoryRouter.route('/').post(
    [
        verifyJwt,
        // validate(anomalyHistoryValidators.getAnomalyHistory)
    ],
    anomalyHistoryController.getAnomalyHistory
);
anomalyHistoryRouter.route('/fields').get(
    [
        verifyJwt,
        //validate(anomalyHistoryValidators.getAnomalyHistory)
    ],
    anomalyHistoryController.getUniqueFields
);
anomalyHistoryRouter
    .route('/statusTimeline/:anomalyHistoryId')
    .get(
        [verifyJwt, validate(anomalyHistoryValidators.getStatus)],
        anomalyHistoryController.getStatusTimeline
    );

anomalyHistoryRouter
    .route('/:anomalyHistoryId')
    .put(
        [verifyJwt, validate(anomalyHistoryValidators.updateStatus)],
        anomalyHistoryController.updateStatus
    );
anomalyHistoryRouter.route('/anomaly/:anomalyHistoryId').get(
    [
        verifyJwt,
        //validate(anomalyHistoryValidators.getStatus)
    ],
    anomalyHistoryController.getAnomalies
);

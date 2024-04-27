import express from 'express';
import { validate } from 'express-validation';
import { anomalyHistoryController } from './anomalyHistory.controllers';
import { anomalyHistoryValidators } from './anomalyHistory.validation';
import { verifyJwt } from '../../middleware/verifyJwt';
export const anomalyHistoryRouterNew = express.Router();

anomalyHistoryRouterNew
    .route('/')
    .post(
        [verifyJwt, validate(anomalyHistoryValidators.getAnomalyHistory)],
        anomalyHistoryController.getAnomalyHistory
    );
anomalyHistoryRouterNew
    .route('/fields')
    .get(
        [verifyJwt, validate(anomalyHistoryValidators.getAnomalyHistory)],
        anomalyHistoryController.getUniqueFields
    );
anomalyHistoryRouterNew.route('/statusTimeline/:anomalyHistoryId').get(
    [verifyJwt, validate(anomalyHistoryValidators.getStatus)],

    anomalyHistoryController.getStatusTimeline
);

anomalyHistoryRouterNew
    .route('/:anomalyHistoryId')
    .put(
        [verifyJwt, validate(anomalyHistoryValidators.updateStatus)],
        anomalyHistoryController.updateStatus
    );
anomalyHistoryRouterNew
    .route('/anomaly/:anomalyHistoryId')
    .get(
        [verifyJwt, validate(anomalyHistoryValidators.getStatus)],
        anomalyHistoryController.getAnomalyDetails
    );

anomalyHistoryRouterNew
    .route('/anomaly/day')
    .post(
        [verifyJwt, validate(anomalyHistoryValidators.chartValidation)],
        anomalyHistoryController.getAnomaliesCountPerDay
    );

anomalyHistoryRouterNew
    .route('/anomaly/sensor')
    .post(
        [verifyJwt, validate(anomalyHistoryValidators.chartValidation)],
        anomalyHistoryController.getAnomaliesCountPerSensor
    );
anomalyHistoryRouterNew
    .route('/anomaly/history')
    .post(
        [verifyJwt, validate(anomalyHistoryValidators.historyAnomalies)],
        anomalyHistoryController.getAnomalyHistoryGraph
    );

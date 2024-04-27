// import coreJoi from 'joi';
// import joiDate from '@joi/date';
// const joi = coreJoi.extend(joiDate) as typeof coreJoi;

import DateExtension from '@joi/date';
import JoiImport from 'joi';

const Status = ['Open', 'In-Progress', 'Resolved', 'Not-Anomaly'];
const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const Sort = [
    'name-a',
    'name-d',
    'status-a',
    'status-d',
    'anomaly-a',
    'anomaly-d',
    'timestamp-a',
    'timestamp-d',
];
const { string, array, boolean, number, binary, date } = JoiImport.types();
const joi = JoiImport.extend(DateExtension) as typeof JoiImport;

const getAnomalyValidation = joi.object({
    date1: joi.date(),
    date2: joi.date(),
    deviceID: joi.array().items(string),
    deviceName: joi.array().items(string),
    sensorName: joi.array().items(string),
    status: joi.array().items(string),
    sort: string.valid(...Sort),
});
const getAnomlayParamsValidation = joi.object({
    anomalyHistoryId: string.hex().length(24).required(),
});
const updateStatusBodyValidation = joi.object({
    statusName: string.valid(...Status).required(),
    statusDescription: string.allow(null, ''),
    changedBy: string.hex().length(24).required(),
    timestamp: date.timestamp().required(),
});
const getAnomalyChartValidation = joi.object({
    deviceID: string.required(),
    month: string.valid(...months).required(),
    year: string.required(),
});
const getAnomalyHistoryValidation = joi.object({
    deviceID: string.required(),
    sensor: string.required(),
    date: joi.date().required(),
});
export const anomalyHistoryValidators = {
    getAnomalyHistory: {
        body: getAnomalyValidation,
    },
    getStatus: { params: getAnomlayParamsValidation },
    updateStatus: {
        params: getAnomlayParamsValidation,
        body: updateStatusBodyValidation,
    },
    chartValidation: {
        body: getAnomalyChartValidation,
    },
    historyAnomalies: {
        body: getAnomalyHistoryValidation,
    },
};

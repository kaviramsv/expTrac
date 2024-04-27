// import coreJoi from 'joi';
// import joiDate from '@joi/date';
// const joi = coreJoi.extend(joiDate) as typeof coreJoi;

import DateExtension from '@joi/date';
import JoiImport from 'joi';

const Status = ['Open', 'In-Progress', 'Resolved', 'Not-Anomaly'];

const { string, array, boolean, number, binary, date } = JoiImport.types();
const joi = JoiImport.extend(DateExtension) as typeof JoiImport;

const getAnomalyHistoryByDeviceValidation = joi.object({
    date: joi.date().format('YYYY-MM-DD').raw().required(),
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
export const anomalyHistoryValidators = {
    getAnomalyHistory: {
        params: getAnomalyHistoryByDeviceValidation,
    },
    getStatus: { params: getAnomlayParamsValidation },
    updateStatus: {
        params: getAnomlayParamsValidation,
        body: updateStatusBodyValidation,
    },
};

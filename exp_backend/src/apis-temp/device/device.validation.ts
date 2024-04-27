// import coreJoi from 'joi';
// import joiDate from '@joi/date';
// const joi = coreJoi.extend(joiDate) as typeof coreJoi;

import DateExtension from '@joi/date';
import JoiImport from 'joi';

const Status = ['Open', 'In-Progress', 'Resolved', 'Not-Anomaly'];
const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const { string, array, boolean, number, binary, date } = JoiImport.types();
const joi = JoiImport.extend(DateExtension) as typeof JoiImport;

const getDeviceParamsValidation = joi.object({
    deviceID: string.required(),
});

export const deviceValidators = {
    getDevice: { params: getDeviceParamsValidation },
};

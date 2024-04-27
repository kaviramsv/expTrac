import DateExtension from '@joi/date';
import JoiImport from 'joi';

const { string, array, boolean, number, binary, date } = JoiImport.types();
const joi = JoiImport.extend(DateExtension) as typeof JoiImport;

const getDeviceParamsValidation = joi.object({
    deviceID: string.required(),
});

export const thresholdValidators = {
    getDevice: { body: getDeviceParamsValidation },
};

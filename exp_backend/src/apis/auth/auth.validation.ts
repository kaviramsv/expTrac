import Joi from 'joi';

const { string, array, boolean, number, binary } = Joi.types();
const updatePasswordValidation = Joi.object({
    username: string.required(),
    oldPassword: string.required(),
    newPassword: string.required(),
});
const loginUserValidation = Joi.object({
    username: string.required(),
    password: string.required(),
});
export const userValidators = {
    updateUser: { body: updatePasswordValidation },
    loginUser: { body: loginUserValidation },
};

import Joi from 'joi';
import mongodb from 'mongodb';
// import passwordComplexity from 'joi-password-complexity';
//if true then it can't be edited or deleted and the default value is false

const { string, array, boolean, number, binary } = Joi.types();

const getContactParamsValidation = Joi.object({
    contactId: string.hex().length(24).required(),
});

// const complexityOptions = {
//     min: 8,
//     max: 64,
//     lowerCase: 1,
//     upperCase: 1,
//     numeric: 1,
//     symbol: 1,
//     requirementCount: 6,
// };
const createUserValidation = Joi.object({
    email: string
        .email({
            // minDomainSegments: 2,
            // tlds: { allow: ['com', 'net'] },
        })
        .required(),
    name: string.trim().min(3).max(64).required(),
});
const updateContactValidation = Joi.object({
    email: string.email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
    }),
    name: string.trim().min(3).max(64),
}).or('name', 'email');
// password: passwordComplexity(complexityOptions).required(),
export const contactValidators = {
    createContact: { body: createUserValidation },
    getContact: {},
    updateContact: {
        params: getContactParamsValidation,
        body: updateContactValidation,
    },
    deleteContact: { params: getContactParamsValidation },
};

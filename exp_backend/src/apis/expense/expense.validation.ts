// import coreJoi from 'joi';
// import joiDate from '@joi/date';
// const joi = coreJoi.extend(joiDate) as typeof coreJoi;

import DateExtension from '@joi/date';
import JoiImport from 'joi';
const Sort = [
    'category-a',
    'category-d',
    'shop-a',
    'shop-d',
    'amount-a',
    'amount-d',
    'timestamp-a',
    'timestamp-d',
];
const Category = [
    'Restaurant',
    'Kids',
    'Grocery',
    'Travel',
    'Fuel',
    'Clothing',
    'Gifts',
    'Medical',
    'Utilities',
    'Others',
];
const SpendFor = ['family', 'kids', 'Kavita', 'Ramesh'];
const CardName = ['Ramesh Cc', 'Kavita Cc', 'Costco Cc', 'Cash'];

const { string, array, boolean, number, binary, date } = JoiImport.types();
const joi = JoiImport.extend(DateExtension) as typeof JoiImport;

const getExpenseValidation = joi.object({
    date1: joi.date(),
    date2: joi.date(),
    shop: joi.array().items(string),
    category: joi.array().items(string),
    cardName: joi.array().items(string),
    tag: joi.array().items(string),
    spendFor: joi.array().items(string),
    sort: string.valid(...Sort),
});

export const expenseValidators = {
    getExpense: {
        body: getExpenseValidation,
    },
    // updateStatus: {
    //     params: getAnomlayParamsValidation,
    //     body: updateStatusBodyValidation,
    // },
};

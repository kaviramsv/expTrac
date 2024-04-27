import express from 'express';
import { validate } from 'express-validation';
import { expenseController } from './expense.controllers';
import { expenseValidators } from './expense.validation';
import { verifyJwt } from '../../middleware/verifyJwt';
export const expenseRouter = express.Router();

expenseRouter.route('/').post(
    [
        //verifyJwt,
        validate(expenseValidators.getExpense),
    ],
    expenseController.getExpense
);

expenseRouter.route('/fields').get(
    [
        //verifyJwt,
        //validate(expenseValidators.getExpense),
    ],
    expenseController.getUniqueFields
);
expenseRouter.route('/category').post(
    [
        //verifyJwt,
        //validate(expenseValidators.getExpense),
    ],
    expenseController.getExpensesCountPerCatgeory
);
expenseRouter.route('/month').post(
    [
        //verifyJwt,
        //validate(expenseValidators.getExpense),
    ],
    expenseController.getExpensesCountPerMonth
);
expenseRouter.route('/day').post(
    [
        //verifyJwt,
        //validate(expenseValidators.getExpense),
    ],
    expenseController.getExpensesCountPerDay
);
expenseRouter.route('/card').post(
    [
        //verifyJwt,
        //validate(expenseValidators.getExpense),
    ],
    expenseController.getExpensesCountPerCard
);
expenseRouter.route('/event').post(
    [
        //verifyJwt,
        //validate(expenseValidators.getExpense),
    ],
    expenseController.getExpensesCountPerEvent
);
expenseRouter.route('/store').post(
    [
        //verifyJwt,
        //validate(expenseValidators.getExpense),
    ],
    expenseController.getExpensesCountPerStore
);
expenseRouter.route('/total').post(
    [
        //verifyJwt,
        //validate(expenseValidators.getExpense),
    ],
    expenseController.getTotalPerMonth
);

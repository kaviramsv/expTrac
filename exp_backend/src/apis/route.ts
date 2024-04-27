import express from 'express';
import { validate } from 'express-validation';

import { authRouter } from './auth/auth.routes';
import { contactRouter } from './contact/contact.routes';
import { expenseRouter } from './expense/expense.routes';

export const protectedRouter = express.Router();

protectedRouter.use('/auth', authRouter);
protectedRouter.use('/contact', contactRouter);
protectedRouter.use('/expense', expenseRouter);



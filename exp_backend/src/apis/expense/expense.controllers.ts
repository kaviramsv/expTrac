import { INTERNAL_SERVER_ERROR } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { model, Schema, Types } from 'mongoose';
import mongoose from 'mongoose';
import { success } from '../../helpers/APISuccess';
import { badRequest, errorMessage, notFound } from '../../helpers/error';
import { ExpenseModel } from './expense.model';

import { UserModel } from '../auth/auth.model';
import { config } from '../../config/config';
import paginate from '../../middleware/paginate';
import { cardModel } from '../cardDetails/card.model';
const getExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        console.log('Req body', req.body);

        let page = Number(req.query?.page) || 1;
        console.log('Req query', page, typeof page);
        let queryArr = [];
        queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

        if (req.body.shop) {
            queryArr.push({ shop: { $in: req.body.shop } });
        }
        if (req.body.category) {
            queryArr.push({ category: { $in: req.body.category } });
        }
        if (req.body.cardName) {
            queryArr.push({ cardName: { $in: req.body.cardName } });
        }
        if (req.body.tag) {
            queryArr.push({
                tag: { $in: req.body.tag },
            });
        }
        if (req.body.spendFor) {
            queryArr.push({
                spendFor: { $in: req.body.spendFor },
            });
        }
        if (req.body.date1 && req.body.date2) {
            const startDate = new Date(String(req.body.date1));
            const endDate = new Date(String(req.body.date2)); //DATE 1 + ONE Day
            console.log('start and end date', startDate, endDate);
            // endDate.setDate(endDate.getDate() + 1);

            queryArr.push({
                timestamp: {
                    $gte: new Date(String(req.body.date1)),
                    $lt: new Date(String(req.body.date2)),
                },
            });
        }
        console.log(queryArr);

        const expense = await ExpenseModel.aggregate([
            {
                $match: {
                    $and: queryArr,
                },
            },
        ]);
        console.log('expense', expense);
        let filtered = [...expense];
        if (req.body.sort) {
            let sortParam = req.body.sort;
            if (sortParam == 'category-a') {
                filtered = [...filtered].sort((a, b) => {
                    const categoryA = a.category; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const categoryB = b.category;
                    if (categoryA < categoryB) {
                        return -1;
                    }
                    if (categoryA > categoryB) {
                        return 1;
                    }
                    return 0;
                });
                // console.log("filtered", filtered);
            }
            //sort name -descending
            if (sortParam == 'category-d') {
                filtered = [...filtered].sort((a, b) => {
                    const categoryA = a.category; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const categoryB = b.category;
                    if (categoryA < categoryB) {
                        return 1;
                    }
                    if (categoryA > categoryB) {
                        return -1;
                    }
                    return 0;
                });
                //console.log("filtered", filtered);
            }
            if (sortParam == 'shop-a') {
                filtered = [...filtered].sort((a, b) => {
                    const shopA = a.shop; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const shopB = b.shop;
                    if (shopA < shopB) {
                        return -1;
                    }
                    if (shopA > shopB) {
                        return 1;
                    }
                    return 0;
                });
                //console.log("filtered", filtered);
            }
            //sort name -descending
            if (sortParam == 'shop-d') {
                filtered = [...filtered].sort((a, b) => {
                    const shopA = a.shop; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const shopB = b.shop;
                    if (shopA < shopB) {
                        return 1;
                    }
                    if (shopA > shopB) {
                        return -1;
                    }
                    return 0;
                });
                //console.log("filtered", filtered);
            }
            if (sortParam == 'amount-a') {
                filtered = [...filtered].sort((a, b) => {
                    const amountA = Math.abs(a.amount); // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const amountB = Math.abs(b.amount);
                    if (amountA < amountB) {
                        return -1;
                    }
                    if (amountA > amountB) {
                        return 1;
                    }
                    return 0;
                });
                //console.log("filtered", filtered);
            }
            if (sortParam == 'amount-d') {
                filtered = [...filtered].sort((a, b) => {
                    const amountA = Math.abs(a.amount); // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const amountB = Math.abs(b.amount);
                    if (amountA < amountB) {
                        return 1;
                    }
                    if (amountA > amountB) {
                        return -1;
                    }
                    return 0;
                });
                //console.log("filtered", filtered);
            }
            if (sortParam == 'timestamp-a') {
                filtered = [...filtered].sort((a, b) => {
                    const timestampA = a.timestamp; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const timestampB = b.timestamp;
                    //console.log(timestampA, timestampB);
                    if (timestampA < timestampB) {
                        return -1;
                    }
                    if (timestampA > timestampB) {
                        return 1;
                    }
                    return 0;
                });
                //console.log("filtered", filtered);
            }
            if (sortParam == 'timestamp-d') {
                filtered = [...filtered].sort((a, b) => {
                    const timestampA = a.timestamp; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const timestampB = b.timestamp;
                    if (timestampA < timestampB) {
                        return 1;
                    }
                    if (timestampA > timestampB) {
                        return -1;
                    }
                    return 0;
                });
                //console.log("filtered", filtered);
            }
        }

        // .skip((+req.body.page - 1) * config.data_count)
        // .limit(config.data_count);
        //50
        // let page=
        const pager = paginate(
            filtered.length,
            page ? page : 1,
            config.data_count
        );
        const pageOfItems = filtered.slice(
            pager.startIndex,
            pager.endIndex + 1
        );
        const totalAmount = filtered.reduce((a, b) => a + b.amount, 0);
        const data = {
            count: filtered.length,
            pager: pager,
            sum: Number(totalAmount.toFixed(2)),
            expense: pageOfItems,
        };

        return res.json(success(data));

        // const data = { count: telemetry.length, telemetry: telemetry };

        // return res.json(success(data));
    } catch (error) {
        console.error({ error });
        return next({
            ...error,
            isPublic: true,
            success: false,
            statusCode: error.status ?? INTERNAL_SERVER_ERROR,
        });
    }
};
const getUniqueFields = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const category = await ExpenseModel.distinct('category');
        const shop = await ExpenseModel.distinct('shop');
        const tag = await ExpenseModel.distinct('tag');
        const spendFor = await ExpenseModel.distinct('spendFor');
        const cardName = await ExpenseModel.distinct('cardName');

        const data = { category, shop, tag, spendFor, cardName };
        return res.json(success(data));
    } catch (error) {
        console.error({ error });
        return next({
            ...error,
            isPublic: true,
            success: false,
            statusCode: error.status ?? INTERNAL_SERVER_ERROR,
        });
    }
};
const getExpensesCountPerCatgeory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { month, year } = req.body;

        let month_Int = parseInt(month, 10);
        let year_Int = parseInt(year, 10);
        let queryArr = [];
        queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

        queryArr.push({
            $expr: {
                $and: [
                    { $eq: [{ $year: '$timestamp' }, year_Int] },
                    { $eq: [{ $month: '$timestamp' }, month_Int] },
                ],
            },
        });
        // }

        const expense = await ExpenseModel.aggregate([
            {
                $match: {
                    $and: queryArr,
                },
            },

            {
                $group: {
                    _id: '$category',
                    count: { $sum: { $toInt: '$amount' } },
                },
            },

            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    count: 1,
                },
            },
        ]);
        let x: any = [];
        let y: any = [];
        expense.forEach((item) => {
            x.push(item.category);
            y.push(item.count);
            return {
                x,
                y,
            };
        });
        console.log('a1,a2', x, y);
        const data = { count: expense.length, expense: { x, y } };

        return res.json(success(data));
    } catch (error) {
        console.error({ error });
        return next({
            ...error,
            isPublic: true,
            success: false,
            statusCode: error.status ?? INTERNAL_SERVER_ERROR,
        });
    }
};

const getExpensesCountPerDay = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        console.log('req body', req.body);

        const { month, year } = req.body;
        let month_Int = parseInt(month, 10);
        let year_Int = parseInt(year, 10);
        console.log('req body', typeof month_Int, year_Int);

        let queryArr = [];
        queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

        queryArr.push({
            $expr: {
                $and: [
                    { $eq: [{ $year: '$timestamp' }, year_Int] },
                    { $eq: [{ $month: '$timestamp' }, month_Int] },
                ],
            },
        });

        const expense = await ExpenseModel.aggregate([
            {
                $match: {
                    $and: queryArr,
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$timestamp',
                        },
                    },

                    count: { $sum: { $toInt: '$amount' } },
                },
            },
            {
                $sort: { _id: 1 },
            },
            {
                $project: {
                    _id: 0,
                    x: '$_id',
                    y: '$count',
                },
            },
        ]);

        const data = { count: expense.length, expense: expense };

        return res.json(success(data));
    } catch (error) {
        console.error({ error });
        return next({
            ...error,
            isPublic: true,
            success: false,
            statusCode: error.status ?? INTERNAL_SERVER_ERROR,
        });
    }
};
const getExpensesCountPerMonth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        console.log('req body', req.body);

        const { month, year } = req.body;
        let month_Int = parseInt(month, 10);
        let year_Int = parseInt(year, 10);
        console.log('req body', typeof month_Int, year_Int);

        let queryArr = [];
        queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

        queryArr.push({
            $expr: {
                $and: [{ $eq: [{ $year: '$timestamp' }, year_Int] }],
            },
        });

        const expense = await ExpenseModel.aggregate([
            {
                $match: {
                    $and: queryArr,
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $month: '$timestamp',
                    },

                    count: { $sum: { $toInt: '$amount' } },
                },
            },
            {
                $sort: { _id: 1 },
            },
            {
                $project: {
                    _id: 0,
                    x: '$_id',
                    y: '$count',
                },
            },
        ]);

        const data = { count: expense.length, expense: expense };

        return res.json(success(data));
    } catch (error) {
        console.error({ error });
        return next({
            ...error,
            isPublic: true,
            success: false,
            statusCode: error.status ?? INTERNAL_SERVER_ERROR,
        });
    }
};
const getExpensesCountPerCard = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { month, year } = req.body;

        let month_Int = parseInt(month, 10);
        let year_Int = parseInt(year, 10);
        let queryArr = [];
        queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

        queryArr.push({
            $expr: {
                $and: [
                    { $eq: [{ $year: '$timestamp' }, year_Int] },
                    { $eq: [{ $month: '$timestamp' }, month_Int] },
                ],
            },
        });
        // }

        const expense = await ExpenseModel.aggregate([
            {
                $match: {
                    $and: queryArr,
                },
            },
            {
                $lookup: {
                    from: 'cardDetails',
                    localField: 'cardName',
                    foreignField: 'name',
                    as: 'name',
                },
            },
            {
                $unwind: '$name',
            },
            //o/w return an object  :[12/22] instead of 12/22 in expiry or any other stages
            {
                $group: {
                    _id: '$cardName',
                    amount: { $sum: { $toInt: '$amount' } },
                    expiry: { $first: '$name.expiry' },
                    ending: { $first: '$name.ending' },
                    colour: { $first: '$name.colour' },
                    type: { $first: '$name.type' },
                    bank: { $first: '$name.bank' },
                    category: { $first: '$name.category' },
                },
            },

            {
                $project: {
                    _id: 0,
                    name: '$_id',
                    amount: 1,
                    expiry: 1,
                    ending: 1,
                    colour: 1,
                    type: 1,
                    bank: 1,
                    category: 1,
                },
            },
        ]);

        const cards = await cardModel.find({});

        const names = [...new Set(cards.map((e) => e.name))];
        console.log('names', names, expense);
        let cardsRem: any[] = [];
        names.forEach((exp) => {
            // compare expense array of names and  cards array
            if (![...new Set(expense.map((e: any) => e.name))].includes(exp)) {
                cardsRem.push(exp);
            }
        });

        cardsRem.forEach((item) => {
            let details = cards.find(({ name }) => name === item);
            expense.push(details);
        });
        const data = { count: expense.length, expense };

        return res.json(success(data));
    } catch (error) {
        console.error({ error });
        return next({
            ...error,
            isPublic: true,
            success: false,
            statusCode: error.status ?? INTERNAL_SERVER_ERROR,
        });
    }
};
const getExpensesCountPerEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { month, year } = req.body;

        let month_Int = parseInt(month, 10);
        let year_Int = parseInt(year, 10);
        let queryArr = [];
        queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

        queryArr.push({
            $expr: {
                $and: [
                    { $eq: [{ $year: '$timestamp' }, year_Int] },
                    { $eq: [{ $month: '$timestamp' }, month_Int] },
                ],
            },
        });
        queryArr.push({ tag: { $ne: null } });

        const expense = await ExpenseModel.aggregate([
            {
                $match: {
                    $and: queryArr,
                },
            },

            {
                $group: {
                    _id: '$tag',
                    expense: { $sum: { $toInt: '$amount' } },
                    timestamp: { $first: '$timestamp' },
                },
            },

            {
                $project: {
                    _id: 0,
                    event: '$_id',
                    expense: 1,
                    timestamp: 1,
                },
            },
        ]);

        const data = { count: expense.length, expense };

        return res.json(success(data));
    } catch (error) {
        console.error({ error });
        return next({
            ...error,
            isPublic: true,
            success: false,
            statusCode: error.status ?? INTERNAL_SERVER_ERROR,
        });
    }
};

const getExpensesCountPerStore = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { month, year } = req.body;

        let month_Int = parseInt(month, 10);
        let year_Int = parseInt(year, 10);
        let queryArr = [];
        queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

        queryArr.push({
            $expr: {
                $and: [
                    { $eq: [{ $year: '$timestamp' }, year_Int] },
                    { $eq: [{ $month: '$timestamp' }, month_Int] },
                ],
            },
        });
        // }

        const expense = await ExpenseModel.aggregate([
            {
                $match: {
                    $and: queryArr,
                },
            },

            {
                $group: {
                    _id: '$shop',
                    count: { $sum: { $toInt: '$amount' } },
                },
            },

            {
                $project: {
                    _id: 0,
                    shop: '$_id',
                    count: 1,
                },
            },
        ]);
        let x: any = [];
        let y: any = [];
        expense.forEach((item) => {
            x.push(item.shop);
            y.push(item.count);
            return {
                x,
                y,
            };
        });
        console.log('a1,a2', x, y);
        const data = { count: expense.length, expense: { x, y } };

        return res.json(success(data));
    } catch (error) {
        console.error({ error });
        return next({
            ...error,
            isPublic: true,
            success: false,
            statusCode: error.status ?? INTERNAL_SERVER_ERROR,
        });
    }
};
const getTotalPerMonth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { month, year } = req.body;

        let month_Int = parseInt(month, 10);
        let year_Int = parseInt(year, 10);
        let queryArr = [];
        queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

        queryArr.push({
            $expr: {
                $and: [
                    { $eq: [{ $year: '$timestamp' }, year_Int] },
                    { $eq: [{ $month: '$timestamp' }, month_Int] },
                ],
            },
        });

        const expense = await ExpenseModel.aggregate([
            {
                $match: {
                    $and: queryArr,
                },
            },

            { $group: { _id: null, sum: { $sum: '$amount' } } },
            { $project: { _id: 0, sum: 1 } },
        ]);

        const data = { expense: expense[0].sum.toFixed(2) };

        return res.json(success(data));
    } catch (error) {
        console.error({ error });
        return next({
            ...error,
            isPublic: true,
            success: false,
            statusCode: error.status ?? INTERNAL_SERVER_ERROR,
        });
    }
};
export const expenseController = {
    getExpense,
    getUniqueFields,
    getExpensesCountPerCatgeory,
    getExpensesCountPerDay,
    getExpensesCountPerCard,
    getExpensesCountPerMonth,
    getExpensesCountPerEvent,
    getExpensesCountPerStore,
    getTotalPerMonth,
};

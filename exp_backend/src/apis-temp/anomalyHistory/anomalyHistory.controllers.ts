import { INTERNAL_SERVER_ERROR } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { model, Schema, Types } from 'mongoose';
import mongoose from 'mongoose';
import { success } from '../../helpers/APISuccess';
import { badRequest, errorMessage, notFound } from '../../helpers/error';
import { AnomalyHistoryModel } from './anomalyHistory.model';

const getAnomalyHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        console.log('Req body', req.body);

        let queryArr = [];
        queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

        if (req.body.deviceID) {
            queryArr.push({ deviceID: { $in: req.body.deviceID } });
        }
        if (req.body.status) {
            queryArr.push({ status: { $in: req.body.status } });
        }
        // if (req.query.sensor) {
        //     queryArr.push({
        //         '$anomalies.name': { $in: req.body.sensor },
        //     });
        // }
        // { $slice: ['$anomalies', 2] }
        //check for status.statusName in last element OF ARRAY OF oBJECTS
        // if (req.query.status) {
        //     queryArr.push({
        //         $expr: {
        //             $in: [
        //                 { $arrayElemAt: ['$status.statusName', -1] },
        //                 req.query.status,
        //             ],
        //         },
        //     });
        // }

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
        const telemetry = await AnomalyHistoryModel.find({
            $and: queryArr,
        }).sort({ timestamp: 1 });
        const telemetry1 = await AnomalyHistoryModel.aggregate(
            // Initial document match (uses index, if a suitable one is available)
            [
                {
                    $match: {
                        $and: queryArr,
                    },
                },

                { $unwind: '$anomalies' },
                { $sort: { 'anomalies.percentage_difference': 1 } },
                {
                    $group: {
                        _id: '$_id',
                        anomalies: { $push: '$anomalies' },
                    },
                },
            ]
        );

        const telemetry2 = await AnomalyHistoryModel.aggregate([
            {
                $match: {
                    $and: queryArr,
                },
            },

            //1.extract anomalies array
            { $unwind: '$anomalies' },
            {
                $addFields: {
                    // 2. insert a new field-(named diff) and find absolute difference
                    diff: {
                        $abs: {
                            $subtract: [0, '$anomalies.percentage_difference'],
                        },
                    },
                },
            },

            //3.sort based on new field:diff
            { $sort: { diff: -1 } },
            //4.extract status array
            //{ $unwind: '$status' },
            // 5.Look up for fields - changed by, and put it in a sub field

            // {
            //     $lookup: {
            //         from: 'user',
            //         let: { user_id: '$status.changedBy' },
            //         pipeline: [
            //             { $match: { $expr: { $eq: ['$_id', '$$user_id'] } } },
            //             { $project: { _id: 1, username: 1 } },
            //         ],
            //         as: 'status.modifiedBy',
            //     },
            // },
            // //6.unwind new object
            // { $unwind: '$status.modifiedBy' },

            //7.project all fields
            {
                $group: {
                    _id: '$_id',
                    deviceName: { $first: '$deviceName' },
                    deviceID: { $first: '$deviceID' },
                    //8.push additional field, and combine prev. fields
                    status: { $first: '$status' },
                    // status: {
                    //     $last: '$status.statusName',
                    // },
                    timestamp: { $first: '$timestamp' },
                    //9.push anomalies array back
                    anomalies: { $push: '$anomalies' },
                    //statusChangeRecords: { $addToSet: '$statusChangeRecords' },
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $project: {
                    _id: 1,
                    deviceName: 1,
                    deviceID: 1,
                    status: 1,
                    timestamp: 1,
                    //statusChangeRecords: 1,
                    anomalies: { $slice: ['$anomalies', 2] }, //10.remove the field changed By
                },
            },
            // {
            //     $project: {
            //         _id: 1,
            //         deviceName: 1,
            //         deviceID: 1,
            //         status: 1,
            //         timestamp: 1,
            //         //statusChangeRecords: 1,
            //         anomalies: {
            //             $filter: {
            //                 input: '$anomalies',
            //                 as: 'a',
            //                 cond: {
            //                     $in: ['$$a.name', req.body.sensor],
            //                 },
            //             },
            //         }, //10.remove the field changed By
            //     },
            // },
        ]);

        const data = { count: telemetry2.length, telemetry: telemetry2 };

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

const getUniqueFields = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const deviceID = await AnomalyHistoryModel.distinct('deviceID');
        const deviceName = await AnomalyHistoryModel.distinct('deviceName');
        const status = await AnomalyHistoryModel.distinct(
            'statusChangeRecords.statusName'
        );
        const sensor = await AnomalyHistoryModel.distinct('anomalies.name');

        const data = { deviceID, deviceName, status, sensor };
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
const getStatusTimeline = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { anomalyHistoryId } = req.params;
        const anomaly = await AnomalyHistoryModel.find({
            _id: anomalyHistoryId,
        });
        let id = new mongoose.Types.ObjectId(req.params.anomalyHistoryId);
        const status = await AnomalyHistoryModel.aggregate([
            { $match: { _id: id } },

            { $unwind: '$statusChangeRecords' },
            {
                $addFields: {
                    user_id: { $toObjectId: '$statusChangeRecords.changedBy' },
                },
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'statusChangeRecords.user',
                },
            },
            { $unwind: '$statusChangeRecords.user' },

            {
                $project: {
                    changedBy: '$statusChangeRecords.user.username',
                    userId: '$statusChangeRecords.user._id',
                    statusName: '$statusChangeRecords.statusName',
                    statusDescription: '$statusChangeRecords.statusDescription',
                    timestamp: '$statusChangeRecords.timestamp',
                },
            },

            // {
            //     $group: {
            //         _id: '$_id',
            //         status: {
            //             $push: {
            //                 statusName: '$statusChangeRecords.statusName',
            //                 statusDescription:
            //                     '$statusChangeRecords.statusDescription',
            //                 timestamp: '$statusChangeRecords.timestamp',
            //                 changedBy: '$statusChangeRecords.user.username',
            //                 userId: '$statusChangeRecords.user._id',
            //             },
            //         },
            //     },
            // },
        ]);
        console.log('status', status);
        return res.json(success(status));
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
const getAnomalies = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { anomalyHistoryId } = req.params;
        // const anomaly = await AnomalyHistoryModel.find({
        //     _id: anomalyHistoryId,
        // });
        // if (!anomaly) {
        //     throw notFound(errorMessage.invalidAnomaly);
        // }
        // console.log('anomaly', anomaly[0].anomalies);
        // let data = { id: anomaly[0]._id, anomalies: anomaly[0].anomalies };
        // return res.json(success(data));
        let id = new mongoose.Types.ObjectId(req.params.anomalyHistoryId);
        const telemetry2 = await AnomalyHistoryModel.aggregate([
            {
                $match: {
                    _id: id,
                },
            },

            //1.extract anomalies array
            { $unwind: '$anomalies' },
            {
                $addFields: {
                    // 2. insert a new field-(named diff) and find absolute difference
                    diff: {
                        $abs: {
                            $subtract: [0, '$anomalies.percentage_difference'],
                        },
                    },
                },
            },

            //3.sort based on new field:diff
            { $sort: { diff: -1 } },

            {
                $group: {
                    _id: '$_id',

                    anomalies: { $push: '$anomalies' },
                },
            },
            {
                $project: {
                    _id: 1,

                    anomalies: 1,
                },
            },
        ]);
        let data = {
            id: telemetry2[0]._id,
            anomalies: telemetry2[0].anomalies,
        };

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
const updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const { anomalyHistoryId } = req.params;
    const { ...bodyParams } = req.body;
    let newStatus = {
        statusName: bodyParams.statusName,
        statusDescription: bodyParams?.statusDescription,
        changedBy: bodyParams.changedBy,
        timestamp: bodyParams.timestamp,
    };
    console.log('newStatus:', newStatus);
    try {
        const anomalyDoc = await AnomalyHistoryModel.findOneAndUpdate(
            { _id: anomalyHistoryId },
            { $addToSet: { statusChangeRecords: newStatus } },
            { new: true }
        );
        if (!anomalyDoc) {
            throw notFound(errorMessage.invalidAnomaly);
        }
        if (bodyParams.statusName) anomalyDoc.status = bodyParams.statusName;
        await anomalyDoc.save();

        console.log('anomalyDoc', anomalyDoc);
        return res.json(success('Status Updated'));
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
export const anomalyHistoryController = {
    getAnomalyHistory,
    getUniqueFields,
    getStatusTimeline,
    updateStatus,
    getAnomalies,
};

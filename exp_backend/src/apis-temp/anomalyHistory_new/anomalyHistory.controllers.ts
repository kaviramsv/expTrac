import { INTERNAL_SERVER_ERROR } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { model, Schema, Types } from 'mongoose';
import mongoose from 'mongoose';
import { success } from '../../helpers/APISuccess';
import { badRequest, errorMessage, notFound } from '../../helpers/error';
import { AnomalyHistoryModel } from './anomalyHistory.model';
import { DeviceModel } from '../device/device.model';
import { UserModel } from '../auth/auth.model';
import { config } from '../../config/config';
import paginate from '../../middleware/paginate';
const getAnomalyHistory = async (
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

        if (req.body.deviceID) {
            queryArr.push({ deviceID: { $in: req.body.deviceID } });
        }
        if (req.body.status) {
            queryArr.push({ status: { $in: req.body.status } });
        }
        if (req.body.deviceName) {
            queryArr.push({ deviceName: { $in: req.body.deviceName } });
        }
        if (req.body.sensorName) {
            queryArr.push({
                'anomalyDetails.name': { $in: req.body.sensorName },
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

        const telemetry = await AnomalyHistoryModel.aggregate([
            {
                $match: {
                    $and: queryArr,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    deviceName: { $first: '$deviceName' },
                    deviceID: { $first: '$deviceID' },
                    status: { $first: '$status' },
                    timestamp: { $first: '$timestamp' },
                    anomalyDetails: { $first: '$anomalyDetails' },
                    parentAnomalyId: { $first: '$parentAnomalyId' },
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
                    parentAnomalyId: 1,
                    sensorName: '$anomalyDetails.name',
                    anomaly_score: '$anomalyDetails.anomaly_score',
                    predicted: '$anomalyDetails.predicted',
                    actual: '$anomalyDetails.actual',
                    raw_difference: '$anomalyDetails.raw_difference',
                    percentage_difference:
                        '$anomalyDetails.percentage_difference',
                    dependence: '$anomalyDetails.dependence',
                },
            },
        ]);

        let filtered = [...telemetry];
        if (req.body.sort) {
            let sortParam = req.body.sort;
            if (sortParam == 'name-a') {
                filtered = [...filtered].sort((a, b) => {
                    const nameA = a.deviceName; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const nameB = b.deviceName;
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                // console.log("filtered", filtered);
            }
            //sort name -descending
            if (sortParam == 'name-d') {
                filtered = [...filtered].sort((a, b) => {
                    const nameA = a.deviceName; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const nameB = b.deviceName;
                    if (nameA < nameB) {
                        return 1;
                    }
                    if (nameA > nameB) {
                        return -1;
                    }
                    return 0;
                });
                //console.log("filtered", filtered);
            }
            if (sortParam == 'status-a') {
                filtered = [...filtered].sort((a, b) => {
                    const statusA = a.status; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const statusB = b.status;
                    if (statusA < statusB) {
                        return -1;
                    }
                    if (statusA > statusB) {
                        return 1;
                    }
                    return 0;
                });
                //console.log("filtered", filtered);
            }
            //sort name -descending
            if (sortParam == 'status-d') {
                filtered = [...filtered].sort((a, b) => {
                    const statusA = a.status; // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const statusB = b.status;
                    if (statusA < statusB) {
                        return 1;
                    }
                    if (statusA > statusB) {
                        return -1;
                    }
                    return 0;
                });
                //console.log("filtered", filtered);
            }
            if (sortParam == 'anomaly-a') {
                filtered = [...filtered].sort((a, b) => {
                    const anomalyA = Math.abs(a.percentage_difference); // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const anomalyB = Math.abs(b.percentage_difference);
                    if (anomalyA < anomalyB) {
                        return -1;
                    }
                    if (anomalyA > anomalyB) {
                        return 1;
                    }
                    return 0;
                });
                //console.log("filtered", filtered);
            }
            if (sortParam == 'anomaly-d') {
                filtered = [...filtered].sort((a, b) => {
                    const anomalyA = Math.abs(a.percentage_difference); // ignore upper and lowercase --sort((a, b) => toRaw(a).name - toRaw(b).name;
                    const anomalyB = Math.abs(b.percentage_difference);
                    if (anomalyA < anomalyB) {
                        return 1;
                    }
                    if (anomalyA > anomalyB) {
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

        const data = {
            count: filtered.length,
            pager: pager,
            telemetry: pageOfItems,
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
// const getAnomalyHistory = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ): Promise<void | Response> => {
//     try {
//         console.log('Req body', req.body);

//         let queryArr = [];
//         queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

//         if (req.body.deviceID) {
//             queryArr.push({ deviceID: { $in: req.body.deviceID } });
//         }
//         if (req.body.status) {
//             queryArr.push({ status: { $in: req.body.status } });
//         }
//         if (req.body.deviceName) {
//             queryArr.push({ deviceName: { $in: req.body.deviceName } });
//         }
//         if (req.body.sensorName) {
//             queryArr.push({
//                 'anomalyDetails.name': { $in: req.body.sensorName },
//             });
//         }
//         if (req.body.date1 && req.body.date2) {
//             const startDate = new Date(String(req.body.date1));
//             const endDate = new Date(String(req.body.date2)); //DATE 1 + ONE Day
//             console.log('start and end date', startDate, endDate);
//             // endDate.setDate(endDate.getDate() + 1);

//             queryArr.push({
//                 timestamp: {
//                     $gte: new Date(String(req.body.date1)),
//                     $lt: new Date(String(req.body.date2)),
//                 },
//             });
//         }
//         console.log(queryArr);

//         const telemetry = await AnomalyHistoryModel.aggregate([
//             {
//                 $match: {
//                     $and: queryArr,
//                 },
//             },
//             {
//                 $group: {
//                     _id: '$_id',
//                     deviceName: { $first: '$deviceName' },
//                     deviceID: { $first: '$deviceID' },
//                     status: { $first: '$status' },
//                     timestamp: { $first: '$timestamp' },
//                     anomalyDetails: { $first: '$anomalyDetails' },
//                     parentAnomalyId: { $first: '$parentAnomalyId' },
//                     // count: { $sum: 1 },
//                 },
//             },
//             {
//                 $sort: { timestamp: -1 },
//             },

//             {
//                 $project: {
//                     _id: 1,
//                     deviceName: 1,
//                     deviceID: 1,
//                     status: 1,
//                     timestamp: 1,
//                     parentAnomalyId: 1,
//                     sensorName: '$anomalyDetails.name',
//                     anomaly_score: '$anomalyDetails.anomaly_score',
//                     predicted: '$anomalyDetails.predicted',
//                     actual: '$anomalyDetails.actual',
//                     raw_difference: '$anomalyDetails.raw_difference',
//                     percentage_difference:
//                         '$anomalyDetails.percentage_difference',
//                     dependence: '$anomalyDetails.dependence',
//                     count: '$count',
//                 },
//             },
//         ]);

//         const data = { count: telemetry.length, telemetry: telemetry };

//         return res.json(success(data));
//     } catch (error) {
//         console.error({ error });
//         return next({
//             ...error,
//             isPublic: true,
//             success: false,
//             statusCode: error.status ?? INTERNAL_SERVER_ERROR,
//         });
//     }
// };

const getUniqueFields = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const deviceID = await DeviceModel.distinct('deviceID');
        const deviceName = await DeviceModel.distinct('deviceName');
        const status = await AnomalyHistoryModel.distinct('status');
        const sensor = await DeviceModel.distinct('sensors');

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
        const anomalyDocument = await AnomalyHistoryModel.findOne({
            _id: req.params.anomalyHistoryId,
        });

        if (!anomalyDocument) {
            throw notFound(errorMessage.invalidAnomaly);
        }
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
const getAnomalyDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { anomalyHistoryId } = req.params;
        const anomalyDocument = await AnomalyHistoryModel.findOne({
            _id: req.params.anomalyHistoryId,
        });

        if (!anomalyDocument) {
            throw notFound(errorMessage.invalidAnomaly);
        }
        let id = new mongoose.Types.ObjectId(req.params.anomalyHistoryId);
        const telemetry2 = await AnomalyHistoryModel.aggregate([
            {
                $match: {
                    _id: id,
                },
            },
            {
                $project: {
                    _id: 1,
                    timestamp: 1,
                    history: '$anomalyDetails.history',
                    dependence: '$anomalyDetails.dependence',
                    actual: '$anomalyDetails.actual',
                    predicted: '$anomalyDetails.predicted',
                },
            },
        ]);
        let data = {
            id: telemetry2[0]._id,
            history: telemetry2[0].history,
            dependence: telemetry2[0].dependence,
            actual: telemetry2[0].actual,
            predicted: telemetry2[0].predicted,
            timestamp: telemetry2[0].timestamp,
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
        const userDocument = await UserModel.findOne({
            _id: bodyParams.changedBy,
        });
        //no user
        if (!userDocument) {
            throw notFound(errorMessage.invalidUser);
        }
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
        return res.json(
            success(
                `Status Updated to ${bodyParams.statusName} by ${bodyParams.changedBy}`
            )
        );
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
// Count of anomalies perday=>given a month, year and deviceId
const getAnomaliesCountPerDay = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        console.log('req body', req.body);

        const { deviceID, month, year } = req.body;
        let month_Int = parseInt(month, 10);
        let year_Int = parseInt(year, 10);
        console.log('req body', typeof month_Int, year_Int);
        const anomalyDocument = await DeviceModel.findOne({
            deviceID: deviceID,
        });

        if (!anomalyDocument) {
            throw notFound(errorMessage.invalidDevice);
        }
        let queryArr = [];
        queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

        queryArr.push({ deviceID: req.body.deviceID });

        queryArr.push({
            $expr: {
                $and: [
                    { $eq: [{ $year: '$timestamp' }, year_Int] },
                    { $eq: [{ $month: '$timestamp' }, month_Int] },
                ],
            },
        });
        // }

        const telemetry = await AnomalyHistoryModel.aggregate([
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

                    count: { $sum: 1 },
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

        const data = { count: telemetry.length, telemetry: telemetry };

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
// Count of anomalies per sensor=>given a month, year and deviceId
//@change?
const getAnomaliesCountPerSensor = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { deviceID, month, year } = req.body;
        let month_Int = parseInt(month, 10);
        let year_Int = parseInt(year, 10);
        let queryArr = [];
        queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

        queryArr.push({ deviceID: req.body.deviceID });

        queryArr.push({
            $expr: {
                $and: [
                    { $eq: [{ $year: '$timestamp' }, year_Int] },
                    { $eq: [{ $month: '$timestamp' }, month_Int] },
                ],
            },
        });
        // }

        const telemetry = await AnomalyHistoryModel.aggregate([
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
                    _id: '$anomalyDetails.name',
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $project: {
                    _id: 0,
                    sensor: '$_id',
                    count: 1,
                },
            },
        ]);
        let x: any = [];
        let y: any = [];
        telemetry.forEach((item) => {
            x.push(item.sensor);
            y.push(item.count);
            return {
                x,
                y,
            };
        });
        console.log('a1,a2', x, y);
        const data = { count: telemetry.length, telemetry: { x, y } };

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
//anomaly details for History Tab

// @change?

const getAnomalyHistoryGraph = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        console.log('Req body', req.body);

        let queryArr = [];
        queryArr.push({ $expr: { $eq: [1, 1] } }); //return all records

        if (req.body.deviceID) {
            queryArr.push({ deviceID: req.body.deviceID });
        }

        if (req.body.sensor) {
            queryArr.push({
                'anomalyDetails.name': req.body.sensor,
            });
        }
        if (req.body.date) {
            const date1 = new Date(String(req.body.date));
            const date2 = new Date(String(req.body.date)); //DATE 1 + ONE Day

            date2.setDate(date2.getDate() + 1);

            // endDate.setDate(endDate.getDate() + 1);

            queryArr.push({
                timestamp: {
                    $gte: date1,
                    $lt: date2,
                },
            });
        }
        console.log(queryArr);

        const history = await AnomalyHistoryModel.aggregate([
            {
                $match: {
                    $and: queryArr,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    deviceName: { $first: '$deviceName' },
                    deviceID: { $first: '$deviceID' },
                    status: { $first: '$status' },
                    timestamp: { $first: '$timestamp' },
                    anomalyDetails: { $first: '$anomalyDetails' },
                },
            },
            {
                $sort: { timestamp: 1 },
            },
            {
                $project: {
                    _id: 1,
                    deviceName: 1,
                    deviceID: 1,
                    status: 1,
                    timestamp: 1,
                    anomalyDetails: 1,
                },
            },
            {
                $project: {
                    _id: 1,
                    anomaly: '$anomalyDetails',
                    x: '$timestamp',
                    y: '$anomalyDetails.actual',
                },
            },
        ]);

        const data = { count: history.length, history: history };

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

export const anomalyHistoryController = {
    getAnomalyHistory,
    getUniqueFields,
    getStatusTimeline,
    updateStatus,
    getAnomalyDetails,
    getAnomaliesCountPerDay,
    getAnomaliesCountPerSensor,
    getAnomalyHistoryGraph,
};

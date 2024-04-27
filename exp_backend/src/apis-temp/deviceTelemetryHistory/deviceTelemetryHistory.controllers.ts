import { INTERNAL_SERVER_ERROR } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { model, Schema, Types } from 'mongoose';
import mongoose from 'mongoose';
import { success } from '../../helpers/APISuccess';
import { badRequest, errorMessage, notFound } from '../../helpers/error';
import { DeviceTelemetryHistoryModel } from './deviceTelemetryHistory.model';
import { DeviceModel } from '../device/device.model';
const getdeviceTelemetryHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { deviceID, date, sensor } = req.body;

        const date1 = new Date(String(date));
        const date2 = new Date(String(date)); //DATE 1 + ONE Day

        date2.setDate(date2.getDate() + 1);

        console.log('d and nd', date2);
        //MATCH DEVICE AND SENSOR
        const deviceDocument = await DeviceModel.findOne({
            $and: [{ deviceID: deviceID }, { sensors: sensor }],
        });
        //IF DEVICE OR SENSOR NOT FOUND
        if (!deviceDocument) {
            return res.status(400).send(errorMessage.invalidDevice);
        }
        const history = await DeviceTelemetryHistoryModel.aggregate([
            {
                $match: {
                    $and: [
                        { deviceID: deviceID },
                        {
                            timestamp: {
                                $gte: date1,
                                $lt: date2,
                            },
                        },
                    ],
                },
            },
            {
                $sort: { timestamp: 1 },
            },
            {
                $project: { timestamp: 1, values: 1, _id: 0 },
            },
            {
                $project: { x: '$timestamp', y: '$values' },
            },
        ]);

        history.map((data: any) => {
            if (data.y) data.y = data.y[sensor];
        });
        const data = { history };

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

export const deviceTelemetryHistoryController = {
    getdeviceTelemetryHistory,
};

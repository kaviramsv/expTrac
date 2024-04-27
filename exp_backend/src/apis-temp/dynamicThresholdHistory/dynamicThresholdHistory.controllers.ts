import { INTERNAL_SERVER_ERROR } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { model, Schema, Types } from 'mongoose';
import mongoose from 'mongoose';
import { success } from '../../helpers/APISuccess';
import { badRequest, errorMessage, notFound } from '../../helpers/error';
import { DeviceDynamicThresholdHistoryModel } from './dynamicThresholdHistory.model';
import { DeviceModel } from '../device/device.model';
const getDeviceDynamicThresholdHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { deviceID } = req.body;

        //MATCH DEVICE AND SENSOR
        const deviceDocument = await DeviceModel.findOne({
            deviceID: deviceID,
        });
        //IF DEVICE OR SENSOR NOT FOUND
        if (!deviceDocument) {
            return res.status(400).send(errorMessage.invalidDevice);
        }
        const thresholdHistory =
            await DeviceDynamicThresholdHistoryModel.aggregate([
                {
                    $match: {
                        $and: [{ deviceID: deviceID }],
                    },
                },
                {
                    $sort: { timestamp: 1 },
                },
                {
                    $project: { timestamp: 1, threshold: 1, _id: 0 },
                },
                {
                    $project: { x: '$timestamp', y: '$threshold' },
                },
            ]);

        const data = { thresholdHistory };

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

export const dynamicThresholdHistoryController = {
    getDeviceDynamicThresholdHistory,
};

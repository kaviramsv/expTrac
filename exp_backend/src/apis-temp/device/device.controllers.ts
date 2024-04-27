import { INTERNAL_SERVER_ERROR } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { model, Schema, Types } from 'mongoose';
import mongoose from 'mongoose';
import { success } from '../../helpers/APISuccess';
import { badRequest, errorMessage, notFound } from '../../helpers/error';
import { DeviceModel } from './device.model';

const getDevices = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const devices = await DeviceModel.aggregate([
            //for each device look up anomaly table
            //match deviceID
            //filter on project=>based on status open
            //project=>the count of open anomalies
            {
                $lookup: {
                    from: 'anomaly_history_new',
                    localField: 'deviceID',
                    foreignField: 'deviceID',
                    as: 'anomalies',
                },
            },
            {
                $project: {
                    _id: 1,
                    deviceName: 1,
                    deviceID: 1,
                    sensors: 1,
                    timestamp: '$lastTelemetryData.timestamp',
                    anomaly: {
                        $filter: {
                            input: '$anomalies',
                            as: 'anomalies',
                            cond: {
                                $eq: ['$$anomalies.status', 'Open'],
                            },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    deviceName: 1,
                    deviceID: 1, //removed sensors
                    timestamp: 1, //CHANGE TO JUST TIMESTAMP
                    openAnomalies: {
                        $size: '$anomaly',
                    },
                },
            },
        ]);
        console.log('get devices');
        return res.json(success(devices));
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
//device page:top bar details
const getDevice = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const deviceDocument = await DeviceModel.findOne({
            deviceID: req.params.deviceID,
        });

        if (!deviceDocument) {
            throw notFound(errorMessage.invalidDevice);
        }
        const device = await DeviceModel.aggregate([
            //for each device look up anomaly table
            //match deviceID
            //filter on project=>based on status open
            //project=>the count of open anomalies
            { $match: { deviceID: req.params.deviceID } },
            {
                $lookup: {
                    from: 'anomaly_history_new',
                    localField: 'deviceID',
                    foreignField: 'deviceID',
                    as: 'anomalies',
                },
            },
            {
                $project: {
                    _id: 1,
                    deviceName: 1,
                    deviceID: 1,
                    sensors: 1,
                    timestamp: '$lastTelemetryData.timestamp',
                    anomaly: {
                        $filter: {
                            input: '$anomalies',
                            as: 'anomalies',
                            cond: {
                                $eq: ['$$anomalies.status', 'Open'],
                            },
                        },
                    },
                },
            },

            {
                $project: {
                    _id: 1,
                    deviceName: 1,
                    deviceID: 1,
                    timestamp: 1,
                    sensorsCount: {
                        $size: '$sensors',
                    },

                    openAnomalies: {
                        $size: '$anomaly',
                    },
                },
            },
        ]);
        let data = {
            id: device[0]._id,
            deviceName: device[0].deviceName,
            deviceID: device[0].deviceID,
            sensorsCount: device[0].sensorsCount,
            openAnomalies: device[0].openAnomalies,
            timestamp: device[0].timestamp,
        };
        console.log('get devices');
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
//@change
const getDeviceLastTelemetry = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const deviceDocument = await DeviceModel.findOne({
            deviceID: req.params.deviceID,
        });

        if (!deviceDocument) {
            throw notFound(errorMessage.invalidDevice);
        }
        const device = await DeviceModel.aggregate([
            //for each device look up anomaly table
            //match deviceID
            //filter on project=>based on status open
            //project=>the count of open anomalies
            { $match: { deviceID: req.params.deviceID } },
            {
                $lookup: {
                    from: 'anomaly_history_new',
                    localField: 'deviceID',
                    foreignField: 'deviceID',
                    as: 'anomalies',
                },
            },
            {
                $project: {
                    _id: 1,
                    deviceName: 1,
                    deviceID: 1,
                    sensors: 1,
                    lastTelemetryData: 1,
                    anomalies: {
                        $filter: {
                            input: '$anomalies',
                            as: 'anomalies',
                            cond: {
                                $eq: ['$$anomalies.status', 'Open'],
                            },
                        },
                    },
                },
            },
            { $unwind: '$anomalies' },
            {
                $group: {
                    _id: '$anomalies.anomalyDetails.name', //sensor
                    count: { $count: {} },
                    // deviceName: { $first: '$deviceName' },
                    // deviceID: { $first: '$deviceID' },
                    // timestamp: {
                    //     $first: '$lastTelemetryData.timestamp',
                    // },
                    // lastTelemetryData: {
                    //     $first: '$lastTelemetryData',
                    // },
                },
            },
            {
                $addFields: { sensor: '$_id' },
            },
            {
                $project: { _id: 0 },
            },
        ]);
        // "data": [
        //     {
        //         "count": 423,
        //         "sensor": "Discharge_Air_Static_Pressure"
        //     },
        //     {
        //         "count": 727,
        //         "sensor": "Discharge_Air_Static_Pressure_Setpoint"
        //     },
        //     {
        //         "count": 683,
        //         "sensor": "Discharge_Air_Temperature"
        //     },
        //     {
        //         "count": 473,
        //         "sensor": "Discharge_Air_Temperature_Setpoint"
        //     },
        //     {
        //         "count": 318,
        //         "sensor": "Entering_Water_Temperature"
        //     },
        //     {
        //         "count": 671,
        //         "sensor": "Leaving_Water_Temperature"
        //     },
        //     {
        //         "count": 789,
        //         "sensor": "Pump_1_Enable"
        //     },
        //     {
        //         "count": 107,
        //         "sensor": "Valve_Differential_Pressure"
        //     },
        //     {
        //         "count": 890,
        //         "sensor": "Valve_Position"
        //     }
        // ]
        //remove additinal fields and just return value for sensor from last telemetry data
        const newObj: any = {};
        device.forEach((item) => {
            newObj[item.sensor] = item.count;
        });
        console.log('newObj', newObj);
        // newObj {
        //     Valve_Differential_Pressure: 107,
        //     Discharge_Air_Static_Pressure: 423,
        //     Discharge_Air_Temperature_Setpoint: 473,
        //     Entering_Water_Temperature: 318,
        //     Discharge_Air_Temperature: 683,
        //     Valve_Position: 890,
        //     Discharge_Air_Static_Pressure_Setpoint: 727,
        //     Leaving_Water_Temperature: 671,
        //     Pump_1_Enable: 789
        //   }
        device.sort((a, b) => {
            const nameA = a.sensor.toUpperCase(); // ignore upper and lowercase
            const nameB = b.sensor.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });
        console.log('final', device);
        //@change
        let sensors: any = deviceDocument.sensors;

        let lastTelemetry: any = deviceDocument.lastTelemetryData;
        let final: any = [];
        sensors.forEach((sensor: any) => {
            final.push({
                deviceID: lastTelemetry?.deviceID,
                deviceName: lastTelemetry?.deviceName,
                sensor: sensor,
                // v % 1 ? v.toFixed(2) : v
                lastTelemetryData: lastTelemetry?.[sensor]
                    ? lastTelemetry[sensor] % 1
                        ? lastTelemetry[sensor].toFixed(2)
                        : lastTelemetry[sensor]
                    : '-',
                timestamp: lastTelemetry?.timestamp
                    ? lastTelemetry?.timestamp
                    : '',
                count: newObj[sensor] ? newObj[sensor] : 0,
            });
        });

        return res.json(success(final));
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
const getUniqueSensorsforDevice = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const { deviceID } = req.params;
        console.log(deviceID);
        const deviceDocument = await DeviceModel.findOne({
            deviceID: deviceID,
        });
        if (!deviceDocument) {
            throw notFound(errorMessage.invalidDevice);
        }

        const data = { sensor: deviceDocument.sensors };
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
export const deviceController = {
    getDevices,
    getDevice,
    getDeviceLastTelemetry,
    getUniqueSensorsforDevice,
    //updateTelemetry
};

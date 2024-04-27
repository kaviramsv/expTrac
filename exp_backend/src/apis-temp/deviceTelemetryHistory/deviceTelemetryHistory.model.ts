import { model, Schema } from 'mongoose';

interface IDeviceHistory {
    timestamp: { type: Date };
    deviceID: { type: String };
    deviceName: { type: String };
    metadata: { type: JSON };
    values: { type: JSON };
    createdAt: Number;
}

const DeviceTelemetryHistorySchema = new Schema<IDeviceHistory>(
    {
        timestamp: { type: Date },
        deviceID: { type: String },
        deviceName: { type: String },
        metadata: { type: JSON },
        values: { type: JSON },
        createdAt: Number,
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

export const DeviceTelemetryHistoryModel = model(
    'device_telemetry_history',
    DeviceTelemetryHistorySchema,
    'device_telemetry_history'
);

import { model, Schema } from 'mongoose';

interface IDevice {
    deviceId: String;
    deviceName: String;
    sensors: Array<String>;
    lastTelemetryData: { type: Object };
    createdAt: Number;
}

// Schema definition for Device
const DeviceSchema = new Schema<IDevice>(
    {
        deviceId: { type: String },
        deviceName: { type: String },
        sensors: [{ type: String }],
        lastTelemetryData: { type: Object },
        createdAt: { type: Number },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

export const DeviceModel = model('device', DeviceSchema, 'device');

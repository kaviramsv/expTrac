import { model, Schema } from 'mongoose';

interface IDeviceDynamicThresholdHistory {
    timestamp: { type: Date };
    deviceID: { type: String };
    threshold: { type: Number };
    createdAt: Number;
}

const DeviceDynamicThresholdHistorySchema =
    new Schema<IDeviceDynamicThresholdHistory>(
        {
            deviceID: { type: String },
            threshold: { type: Number },
            timestamp: { type: Date },
            createdAt: Number,
        },
        {
            timestamps: {
                createdAt: true,
                updatedAt: false,
            },
        }
    );

export const DeviceDynamicThresholdHistoryModel = model(
    'device_dynamic_threshold_history',
    DeviceDynamicThresholdHistorySchema,
    'device_dynamic_threshold_history'
);

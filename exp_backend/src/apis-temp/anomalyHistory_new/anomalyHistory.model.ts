import { model, Schema, Types } from 'mongoose';
interface IHistory {
    timestamp: String;
    value: String;
}
interface IDependence {
    sensor: String;
    value: String;
}
interface IStatus {
    statusName: String;
    statusDescription: String;
    timestamp: String;
    changedBy: String;
}
interface IAnomalyHistory {
    timestamp: Date;
    deviceID: String;
    deviceName: String;
    anomalyDetails: {
        name: String;
        predicted: Number;
        actual: Number;
        raw_difference: Number;
        percentage_difference: Number;
        history: Array<IHistory>;
        dependence: Array<IDependence>;
        anomaly_score: { type: Number };
    };
    status: String;
    statusChangeRecords: Array<IStatus>;
    parentAnomalyId: String;
    createdAt: Number;
}

const AnomalyHistorySchema = new Schema<IAnomalyHistory>(
    {
        timestamp: { type: Date },
        deviceID: { type: String },
        deviceName: { type: String },
        status: { type: String },
        anomalyDetails: {
            name: { type: String },
            predicted: { type: Number },
            actual: { type: Number },
            raw_difference: { type: Number },
            percentage_difference: { type: Number },
            history: [
                {
                    timestamp: { type: Date },
                    value: { type: Number },
                },
            ],
            dependence: [
                {
                    sensor: { type: String },
                    value: { type: Number },
                },
            ],
            anomaly_score: { type: Number },
        },

        statusChangeRecords: [
            {
                statusName: { type: String },
                statusDescription: { type: String },
                timestamp: { type: Number },
                changedBy: { type: String },
            },
        ],
        parentAnomalyId: { type: String },
        createdAt: { type: Number },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

// export const AnomalyHistoryModel = model<IAnomalyHistory>(
//     'anomaly_history_new',
//     AnomalyHistorySchema,
//     'anomaly_history_new'
// );
export const AnomalyHistoryModel = model<IAnomalyHistory>(
    'anomaly_history_new',
    AnomalyHistorySchema,
    'anomaly_history_new'
);

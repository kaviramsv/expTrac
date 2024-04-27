import { model, Schema, Types } from 'mongoose';
interface IHistory {
    timestamp: String;
    value: String;
}
interface IDependence {
    sensor: String;
    value: String;
}
interface IAnomaly {
    name: String;
    predicted: Number;
    actual: Number;
    raw_difference: Number;
    percentage_difference: Number;
    history: Array<IHistory>;
    dependence: Array<IDependence>;
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
    anomalies: Array<IAnomaly>;
    status: String;
    statusChangeRecords: Array<IStatus>;
    createdAt: Number;
}

const AnomalyHistorySchema = new Schema<IAnomalyHistory>(
    {
        timestamp: { type: Date },
        deviceID: { type: String },
        deviceName: { type: String },
        status: { type: String },
        anomalies: [
            {
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
        ],
        statusChangeRecords: [
            {
                statusName: { type: String },
                statusDescription: { type: String },
                timestamp: { type: Number },
                changedBy: { type: String },
            },
        ],
        createdAt: { type: Number },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

export const AnomalyHistoryModel = model<IAnomalyHistory>(
    'anomaly_history',
    AnomalyHistorySchema,
    'anomaly_history'
);
// {
//     "timestamp": 1698344400000,
//     "deviceName": "blabla",
//     "deviceID": 123,
//     "anomalies": [
//       {
//         "name": "Entering_Water_Temperature",
//         "predicted": 1.8523317575454712,
//         "actual": 13.314035415649414,
//         "raw_difference": 11.461703658103943,
//         "percentage_difference": 618.7716434388552
//       },
//       {
//         "name": "Leaving_Water_Temperature",
//         "predicted": 0.6734486222267151,
//         "actual": 0.8202764391899109,
//         "raw_difference": 0.1468278169631958,
//         "percentage_difference": 21.802378402337354
//       },
//       {
//         "name": "Valve_Differential_Pressure",
//         "predicted": 0.5008100271224976,
//         "actual": 0.6652360558509827,
//         "raw_difference": 0.1644260287284851,
//         "percentage_difference": 32.832016098644665
//       },
//       {
//         "name": "Valve_Position",
//         "predicted": 0.011532768607139587,
//         "actual": 0.0,
//         "raw_difference": -0.011532768607139587,
//         "percentage_difference": -100.0
//       },
//       {
//         "name": "Cooling_Discharge_Air_Temperature",
//         "predicted": 1.8325707912445068,
//         "actual": 0.31237319111824036,
//         "raw_difference": -1.5201976001262665,
//         "percentage_difference": -82.95437247986986
//       },
//       {
//         "name": "Pump_1_Enable",
//         "predicted": 0.012548625469207764,
//         "actual": 0.0,
//         "raw_difference": -0.012548625469207764,
//         "percentage_difference": -100.0
//       },
//       {
//         "name": "Discharge_Air_Static_Pressure",
//         "predicted": 6.411315441131592,
//         "actual": 0.43801650404930115,
//         "raw_difference": -5.973298937082291,
//         "percentage_difference": -93.16807123169733
//       },
//       {
//         "name": "Discharge_Air_Static_Pressure_Setpoint",
//         "predicted": 0.05311499536037445,
//         "actual": 0.0,
//         "raw_difference": -0.05311499536037445,
//         "percentage_difference": -100.0
//       },
//       {
//         "name": "Discharge_Air_Temperature",
//         "predicted": 0.47560596466064453,
//         "actual": 0.45356371998786926,
//         "raw_difference": -0.02204224467277527,
//         "percentage_difference": -4.63456018439611
//       },
//       {
//         "name": "Discharge_Air_Temperature_Setpoint",
//         "predicted": 0.5900882482528687,
//         "actual": 0.5,
//         "raw_difference": -0.09008824825286865,
//         "percentage_difference": -15.266911096704881
//       }
//     ],

//   }

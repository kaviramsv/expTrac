import { model, Schema, Types } from 'mongoose';

interface IUser {
    username: string;
    password: string;
    isLoggingInFirstTime: boolean;
    createdBy: string;
    createdAt: number;
}

const userSchema = new Schema<IUser>(
    {
        username: { type: String },
        password: { type: String },
        isLoggingInFirstTime: { type: Boolean },
        createdBy: { type: String },
        createdAt: { type: Number },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

export const UserModel = model<IUser>('user', userSchema, 'user');

import { model, Schema, Types } from 'mongoose';

interface IContact {
    name: string;
    email: string;
    createdBy: string;
    createdAt: number;
}

const contactSchema = new Schema<IContact>(
    {
        name: { type: String },
        email: { type: String, unique: true },
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

export const contactModel = model<IContact>(
    'contact',
    contactSchema,
    'contact'
);

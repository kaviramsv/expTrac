import { model, Schema, Types } from 'mongoose';

interface ICard {
    name: string;
    expiry: string;
    ending: string;
    category: string;
    type: string;
    colour: string;
    bank: string;
    createdBy: string;
    createdAt: number;
}

const cardSchema = new Schema<ICard>(
    {
        name: { type: String, unique: true },
        expiry: { type: String },
        ending: { type: String },
        category: { type: String },
        type: { type: String },
        colour: { type: String },
        bank: { type: String },
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

export const cardModel = model<ICard>('cardDetails', cardSchema, 'cardDetails');

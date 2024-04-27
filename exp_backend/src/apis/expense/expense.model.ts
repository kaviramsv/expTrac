import { model, Schema, Types } from 'mongoose';
interface IExpense {
    timestamp: { type: Date };
    shop: { type: String };
    category: { type: String };
    tag: { type: String };
    amount: { type: Number };
    cardName: { type: String };
    comments: { type: String };
    spendFor: { type: String };
    createdAt: Number;
}

const ExpenseSchema = new Schema<IExpense>(
    {
        timestamp: { type: Date },
        shop: { type: String },
        category: { type: String },
        tag: { type: String },
        amount: { type: Number },
        cardName: { type: String },
        comments: { type: String },
        spendFor: { type: String },
        createdAt: Number,
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

export const ExpenseModel = model<IExpense>(
    'expense',
    ExpenseSchema,
    'expense'
);

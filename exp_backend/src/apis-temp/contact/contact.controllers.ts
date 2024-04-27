import { INTERNAL_SERVER_ERROR } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { success } from '../../helpers/APISuccess';
import { badRequest, errorMessage, notFound } from '../../helpers/error';
import { contactModel } from './contact.model';
import bcrypt from 'bcryptjs';
import { model, Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const getContacts = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const mails = await contactModel.find({});
        console.log('conatct:', mails);
        const data = { mails };
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
const createContact = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    console.log('create:', req.body);
    const { ...bodyParams } = req.body;
    try {
        let newContact = new contactModel({
            name: bodyParams.name,
            email: bodyParams.email,
        });

        newContact = await newContact.save();
        await newContact.save();

        let data = {
            success: true,
            message: `Conatact with name ${newContact.email} created!`,
            data: {
                newContactId: newContact._id,
            },
        };

        return res.json(success(data));
    } catch (error) {
        console.error({ error });
        if (error.name === 'MongoServerError' && error.code === 11000) {
            // Duplicate Email name
            return res.status(422).send({
                success: false,
                message: `The following email ${error.keyValue.email} already exists associated with another name in the database!`,
            });
        }

        return next({
            ...error,
            isPublic: true,
            success: false,
            statusCode: error.status ?? INTERNAL_SERVER_ERROR,
        });
    }
};
const deleteContact = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const { contactId } = req.params;

    console.log('delete:', contactId);
    try {
        await contactModel.findOneAndRemove({
            _id: contactId,
        });

        return res.json(success('Contact Deleted'));
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
const updateContact = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const { contactId } = req.params;
    const { ...bodyParams } = req.body;

    try {
        const contactDocument = await contactModel.findOne({
            _id: contactId,
        });
        if (!contactDocument) {
            throw notFound(errorMessage.invalidContact);
        }

        if (bodyParams.name) contactDocument.name = bodyParams.name;
        if (bodyParams.email) contactDocument.email = bodyParams.email;
        await contactDocument.save();

        return res.json(success('Contact Updated'));
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
export const contactController = {
    getContacts,
    createContact,
    deleteContact,
    updateContact,
};

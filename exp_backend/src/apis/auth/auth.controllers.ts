import { INTERNAL_SERVER_ERROR } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { success } from '../../helpers/APISuccess';
import { badRequest, errorMessage, notFound } from '../../helpers/error';
import { UserModel } from './auth.model';
import bcrypt from 'bcryptjs';
import { model, Schema, Types } from 'mongoose';
import mongoose from 'mongoose';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { config } from '../../config/config';
export const SECRET_KEY: Secret = config.secret;
const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const userDocument = await UserModel.findOne({
            username: username,
        });
        //no user
        if (!userDocument) {
            return res.status(401).send({
                success: false,
                message: `Incorrect Username or Password`,
            });
        }
        //username exists and pwd right
        if (await bcrypt.compare(password, userDocument.password)) {
            // //add to session
            // req.session.username = userDocument.username;
            const token = jwt.sign(
                { _id: userDocument?._id, name: userDocument?.username },
                SECRET_KEY,
                {
                    expiresIn: '1d',
                }
            );
            const data = {
                token: token,
                userId: userDocument._id,
                isLoggingInFirstTime: userDocument.isLoggingInFirstTime,
            };
            return res.json(success(data));
        }
        ///username exists and pwd wrong
        return res.status(401).send({
            success: false,
            message: `Incorrect Username or Password`,
        });
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
const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    const salt = 10;
    const { ...bodyParams } = req.body; //old password,new password

    const hashedPassword = await bcrypt.hash(bodyParams.newPassword, salt);
    console.log('in auth', bodyParams);
    try {
        const userDocument = await UserModel.findOne({
            username: bodyParams.username,
        });
        if (!userDocument) {
            throw notFound(errorMessage.invalidUser);
        }
        //if old password is correct then reset new
        if (
            await bcrypt.compare(bodyParams.oldPassword, userDocument.password)
        ) {
            if (bodyParams.newPassword) userDocument.password = hashedPassword;
            userDocument.isLoggingInFirstTime = false;
            await userDocument.save();
            return res.json(success('Password Update Successful'));
        } else {
            return res.status(400).send({
                success: false,
                message: `Old Password Incorrect`,
            });
        }
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
export const userController = {
    loginUser,
    resetPassword,
};

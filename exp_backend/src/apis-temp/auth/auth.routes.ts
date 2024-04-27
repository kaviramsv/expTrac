import express from 'express';
import { validate } from 'express-validation';
import { userController } from './auth.controllers';
import { userValidators } from './auth.validation';
import { verifyJwt } from '../../middleware/verifyJwt';
import { success } from '../../helpers/APISuccess';
export const authRouter = express.Router();

authRouter
    .route('/login')
    .post([validate(userValidators.loginUser)], userController.loginUser);
authRouter
    .route('/resetPassword')
    .put(
        [verifyJwt, validate(userValidators.updateUser)],
        userController.resetPassword
    );
authRouter
    .route('/authTest')
    .get((req,res) =>{
        console.log('inside get test auth method')
        res.send(success());
    });

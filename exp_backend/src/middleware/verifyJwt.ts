import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';
export const SECRET_KEY: Secret = config.secret;

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const verifyJwt = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('token is :', token);
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        (req as CustomRequest).token = decoded;

        next();
    } catch (err) {
        res.status(401).send('Please authenticate');
    }
};

// import { NextFunction, Request, Response } from 'express';
// import { errorMessage, forbidden } from '../helpers/error';
// import jwt, { Secret, JwtPayload } from 'jsonwebtoken'; //npm i --save-dev @types/jsonwebtoken
// import { config } from '../config';

// export interface CustomRequest extends Request {
//     token: string | JwtPayload;
// }

// export const verifyPermissions = () => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         let token = req.headers['x-access-token'];

//         if (!token) {
//             return res.status(403).json({ message: 'No token provided!' });
//         }
//         try {
//             const decodedToken = jwt.verify(token, config.JWT_SECRET);
//             req.user = decodedToken.user;
//         } catch (err) {}
//     };
// };

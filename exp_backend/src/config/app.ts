import cors from 'cors';
import expressValidation from 'express-validation';
import httpStatus, { INTERNAL_SERVER_ERROR } from 'http-status';
import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from 'express';

import { config } from './config';

import packageJson from '../../package.json';
import { APIError } from '../helpers/APIError';
import { success } from '../helpers/APISuccess';
//import { deviceRouter } from '../apis/device/device.routes';
import { protectedRouter } from '../apis/route';
export const app = express();
var compression = require('compression')

// let session = require('express-session');
// let MongoDBStore = require('connect-mongodb-session')(session);
// var sessionStore = new MongoDBStore({
//     uri: config.mongo.host,
//     collection: 'user_sessions',
// });
// // Catch errors
// sessionStore.on('error', function (error: any) {
//     console.log(error);
// });
// app.use(
//     require('express-session')({
//         secret: 'This is a secret',
//         cookie: {
//             maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
//         },
//         store: sessionStore,
//         // Boilerplate options, see:
//         // * https://www.npmjs.com/package/express-session#resave
//         // * https://www.npmjs.com/package/express-session#saveuninitialized
//         resave: true,
//         saveUninitialized: true,
//     })
// );

// declare module 'express-session' {
//     interface SessionData {
//         username: any;
//     }
// }

app.use(compression())

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Version', packageJson.version);
    return next();
});

app.use(
    cors({
        origin: [
            'http://localhost:4000',
            'https://localhost:3000',
            'http://localhost:443',
            'https://localhost:443',
            'https://staging.manager.trustcoretechnologies.com',
            'http://staging.manager.trustcoretechnologies.com'
        ],
        credentials: true,
        exposedHeaders: ['set-cookie'],
    })
);

// app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json() as RequestHandler);
app.get('/healthcheck', (_, res) => {
    console.log('inside backend health check api');
    res.send(success());
});
// app.get('/checklogin', (req, res) => {
//     console.log('re.session', req.session);
//     res.status(req.session.username ? 200 : 401).send('OK');
// });
// app.use('/api/', deviceRouter);
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     // res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });
app.use('/api/', protectedRouter);
// if error is not an instanceOf APIError, convert it.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof expressValidation.ValidationError) {
        // validation error contains errors which is an array of error each containing message[]
        const unifiedErrorMessage = [
            ...(err.details.params ?? []),
            ...(err.details.body ?? []),
        ]
            ?.map((err) => err.message)
            .join('');
        const error = new APIError(unifiedErrorMessage, err.statusCode, true);
        return next(error);
    } else if (!(err instanceof APIError)) {
        const statusCode =
            typeof err.statusCode === 'number'
                ? err.statusCode
                : INTERNAL_SERVER_ERROR;
        const status = typeof err.status === 'string' ? err.status : '';
        const apiError = new APIError(
            err.message ?? err.reason,
            statusCode,
            err.isPublic,
            status
        );
        return next(apiError);
    }
    return next(err);
});

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.url);
    console.log(req.body);
    const err = new APIError('API not found', httpStatus.NOT_FOUND, true);
    return next(err);
});

interface ResponseObjectInterface {
    message: string;
    stack?: string;
    status?: string;
    success: boolean;
}

// error handler, send stacktrace only during development
app.use(
    (
        err: any,
        req: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _next: NextFunction
    ) => {
        const responseObject: ResponseObjectInterface = {
            success: false,
            message: err.isPublic ? err.message : httpStatus.NOT_FOUND
        };
        if (config.env === 'development') {
            responseObject['stack'] = err.stack;
        }

        if (err.status) {
            responseObject['status'] = err.status;
        }
        return res.status(err.statusCode).json(responseObject);
    }
);

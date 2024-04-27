import mongoose, { ConnectOptions } from 'mongoose';

import { app } from './config/app';
import { config } from './config/config';
import { UserModel } from './apis/auth/auth.model';
import bcrypt from 'bcryptjs';


const fs = require("fs");


if (config.mongo.MONGO_TLS_ENABLED) {
    console.log('inside tls')
    mongoose.connect(config.mongo.host, {
        tls: true,
        //tlsInsecure: false,
        tlsAllowInvalidHostnames: true,
        tlsAllowInvalidCertificates: true,
        tlsCAFile: "/data/certs/mongo/ca-cert.pem",
        //tlsCertificateFile: fs.readFileSync("/data/certs/mongo/server-cert.pem"),
        //tlsCertificateKeyFile: fs.readFileSync("c:\\data\\certs\\mongo\\server-key.pem")
    });
} else {
    console.log('inside non tls')
    mongoose.connect(config.mongo.host);
}

/*const {
    mongo: { host: mongoUri },
    port,
} = config;

mongoose.connect(mongoUri);*/

mongoose.connection.on('connected', async () => {
    console.log('database connect succesfully!');
    const defaultAdminUser = await UserModel.findOne({
        username: config.APP_CONFIG.DEFAULT_USERNAME,
    });
    if (!defaultAdminUser) {
        console.log('Default ADMIN User does not found, Creating default ADMIN user...')
        const hashedPassword = await bcrypt.hash(config.APP_CONFIG.DEFAULT_PASSWORD, 12);
        let newAdminUser = new UserModel({
            username: config.APP_CONFIG.DEFAULT_USERNAME,
            password: hashedPassword,
            isLoggingInFirstTime: true
        });
        await newAdminUser.save();
        console.log('Default ADMIN User created!')
    }else{
        console.log('Default ADMIN User found!')
    }
    const defaultSystemUser = await UserModel.findOne({
        username: 'SYSTEM',
    });
    if (!defaultSystemUser) {
        console.log('Default SYSTEM user not found, Creating default SYSTEM user...')
        const hashedPassword = await bcrypt.hash('SYSTEM_DEFAULT_PASSWORD', 12);
        let newSystemUser = new UserModel({            
            username: "SYSTEM",
            password: hashedPassword,
            isLoggingInFirstTime: false
        });
        await newSystemUser.save();
        console.log('Default SYSTEM user created!')
    }else{
        console.log('Default SYSTEM user found!')
    }
});

mongoose.connection.on('error', (err) => {
    throw new Error(`Unable to connect to database: ${config.mongo.host}`);
});

app.listen(config.port, () => {
    console.log(`Server started successfully! at port ${config.port}`);
});

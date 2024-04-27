import mongoose from 'mongoose';
import request from 'supertest';
import { BAD_REQUEST, OK } from 'http-status';

import chai, { expect } from 'chai';
import { app } from '../../config/app';
import { config } from '../../config/config';
const { mongo } = config;

// TODO: There are some changes in the schema of the reports logs.

const { host: mongoUri } = mongo;

const dbParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

chai.config.includeStack = true;

after((done) => {
    mongoose.connection.close();
    done();
});

before(async () => {
    await mongoose.connect(mongoUri);
});

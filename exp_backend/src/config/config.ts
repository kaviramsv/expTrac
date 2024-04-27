import dotenv from 'dotenv';

import Joi from 'joi';

dotenv.config();

interface EnvInterface {
    MONGO_TLS_ENABLED: boolean;
    MONGO_HOST: string;
    MONGO_PORT: number;
    NODE_ENV: string;
    PORT: number;
    JWT_SECRET: string;
    DEFAULT_USERNAME: string;
    DEFAULT_PASSWORD: string;
    DATA_COUNT: number;
}

const envVariablesSchema: Joi.ObjectSchema<EnvInterface> = Joi.object({
    MONGO_TLS_ENABLED: Joi.bool().default(false),
    MONGO_HOST: Joi.string().required(),
    MONGO_PORT: Joi.number().default(27017),
    NODE_ENV: Joi.string()
        .allow('development', 'production', 'test', 'provision')
        .default('development'),
    JWT_SECRET: Joi.string().required(),
    DEFAULT_USERNAME: Joi.string().default('admin'),
    DEFAULT_PASSWORD: Joi.string().default('password'),
    DATA_COUNT: Joi.number().default(50),
})
    .unknown()
    .required();

const { error, value: envVars } = envVariablesSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
    env: envVars.NODE_ENV,
    APP_CONFIG: {
        DEFAULT_USERNAME: envVars.DEFAULT_USERNAME,
        DEFAULT_PASSWORD: envVars.DEFAULT_PASSWORD,
    },
    mongo: {
        host: envVars.MONGO_HOST,
        port: envVars.MONGO_PORT,
        MONGO_TLS_ENABLED: envVars.MONGO_TLS_ENABLED,
    },
    port: envVars.PORT,
    secret: envVars.JWT_SECRET,
    data_count: envVars.DATA_COUNT,
};

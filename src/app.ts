import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import WinstonLogger from './utils/logger';
import Redis from './utils/redis';

dotenv.config();

const app = express();

const redis = Redis.getInstance();

const logger = WinstonLogger.getInstance();

app.set('port', 4000);

app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


(async () => {
    await mongoose.connect(`${process.env.DATABASE_URL}`, {
        user: process.env.DATABASE_USER,
        pass: process.env.DATABASE_PASSWORD,
        dbName: process.env.DATABASE_NAME,
    })
    logger.info(`DB Connected`);
})();

(async () => {
    await redis.connect();
})();

app.use((req, res, next) => {
    logger.http(`[${req.method}] ${req.url}`);
    next();
});

app.get('/', (req, res, next) => {
    res.json('Server working');
});

export default app;

import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import WinstonLogger from './utils/logger';

dotenv.config();

const app = express();

// 로깅용 initialize
const logger = WinstonLogger.getInstance();

app.set('port', 4000);
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

app.use((req, res, next) => {
    logger.http(`[${req.method}] ${req.url}`);
    next();
});

app.get('/', (req, res, next) => {
    res.json('Server working');
});

export default app;

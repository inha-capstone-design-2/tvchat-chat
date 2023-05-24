import express, {ErrorRequestHandler} from 'express';
import cookieParser from 'cookie-parser';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path'
import WinstonLogger from './utils/logger';
import Redis from './utils/redis';
import chatRouter from './lib/controllers/chatController';
import roomRouter from './lib/controllers/roomController';
import broadcastRouter from './lib/controllers/broadcastController';

dotenv.config();

const app = express();

const redis = Redis.getInstance();

const logger = WinstonLogger.getInstance();

const swaggerSpec = YAML.load(path.join(__dirname, 'swagger.yaml'));

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
    res.json("server working");
});

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.use('/v1/chat', chatRouter);
app.use('/v1/room', roomRouter);
app.use('/v1/broadcast', broadcastRouter);

app.use((req, res) => {
    res.status(404).send({ message: 'page not found' });
});

app.use(((err, req, res, next) => {
    res.status(err.status ?? 500).json({
        message: err.message,
        error: err,
    });
}) as ErrorRequestHandler);

export default app;

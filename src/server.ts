import { createServer } from 'http';
import app from './app';
import WinstonLogger from "./utils/logger";
import useSocket from "./utils/useSocket";
import BroadcastService from "./lib/services/broadcastService";
import cron from "node-cron";

const httpServer = createServer(app);

const broadcastService = BroadcastService.getInstance();
const logger = WinstonLogger.getInstance();

useSocket(httpServer, app);

httpServer.listen(app.get('port'), () => {
    logger.info(`Server listening on port: ${app.get('port')}`);
});

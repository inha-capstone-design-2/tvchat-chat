import { createServer } from 'http';
import app from './app';
import WinstonLogger from "./utils/logger";
import useSocket from "./utils/useSocket";

const httpServer = createServer(app);

const logger = WinstonLogger.getInstance();

useSocket(httpServer, app);

httpServer.listen(app.get('port'), () => {
    logger.info(`Server listening on port: ${app.get('port')}`);
});

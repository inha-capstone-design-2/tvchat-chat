import app from './app';
import WinstonLogger from "./utils/logger";

// 로깅용 initialize
const logger = WinstonLogger.getInstance();

const server = app.listen(app.get('port'), () => {
    logger.info(`Server listening on port: ${app.get('port')}`);
});

export default server;

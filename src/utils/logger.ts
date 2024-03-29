import { createLogger, format, transports, Logger } from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const logFormat = format.printf((info) => {
    return `[${info.timestamp}] [${info.level}] : ${info.message}`; // 날짜 시간 로그레벨: 메세지
});

class WinstonLogger {
    private static instance: WinstonLogger;

    private readonly logger: Logger;

    private constructor() {
        const infoLog = new WinstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD', // 파일 날짜 형식
            dirname: `/tmp/logs/info`, // 파일 경로
            filename: `%DATE%.info.log`, // 파일 이름 형식 2020-05-28.info.log
        });

        const httpLog = new WinstonDaily({
            level: 'http', // http 보다 낮은애들은 모두 파일에 저장
            datePattern: 'YYYY-MM-DD',
            dirname: `/tmp/logs/http`,
            filename: `%DATE%.info.log`,
        });

        const errorLog = new WinstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: `/tmp/logs/error`,
            filename: `%DATE%.error.log`,
        });

        const exceptionLog = new WinstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: `/tmp/logs/exception`,
            filename: `%DATE%.exception.log`,
        });

        const terminalLog = new transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize(),
                format.timestamp({ format: Date.now().toString() }),
                logFormat
            ),
        });

        let transport;
        let exceptionHandler;
        if (process.env.NODE_ENV === 'production') {
            transport = [infoLog, errorLog, httpLog];
            exceptionHandler = exceptionLog;
        } else if (process.env.NODE_ENV === 'development') {
            transport = [infoLog, errorLog, httpLog];
            exceptionHandler = exceptionLog;
        } else {
            transport = terminalLog;
            exceptionHandler = terminalLog;
        }

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({ format: Date.now().toString() }),
                logFormat
            ),
            transports: transport,
            exceptionHandlers: exceptionHandler,
        });
    }

    static getInstance(): WinstonLogger {
        if (!WinstonLogger.instance) {
            WinstonLogger.instance = new WinstonLogger();
        }
        return WinstonLogger.instance;
    }

    info(message: string) {
        this.logger.info(message);
    }

    error(message: string) {
        this.logger.error(message);
    }

    http(message: string) {
        this.logger.http(message);
    }
}

export default WinstonLogger;

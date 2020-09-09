import {createLogger, format, transports} from 'winston';
import {config} from 'server/config';

const {printf} = format;

const appFormat = printf(({level, message, timestamp}) => `[${timestamp}] ${level}: ${message}`);

export const logger = createLogger({
    silent: process.env.DISABLE_LOGGING === '1',
    level: config['logger.level'],
    format: format.combine(
        config['logger.colorize'] ? format.colorize() : format.uncolorize(),
        format.timestamp(),
        appFormat
    ),
    transports: [new transports.Console()]
});

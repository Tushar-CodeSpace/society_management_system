import winston from "winston";

const { combine, printf, colorize, timestamp } = winston.format;

// Log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} | [${level}] | ${message}`;
});

const transports = [];

// Console logging
const consoleLogging = new winston.transports.Console({
    format: combine(
        colorize({ level: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        logFormat
    )
});

transports.push(consoleLogging);

// Logger
export const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transports: [
        ...transports
    ]
});

export default logger;
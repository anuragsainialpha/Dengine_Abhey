import winston from 'winston';
import 'express-async-errors';

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export default function () {
  winston.exceptions.handle(
    new winston.transports.File({
      filename: 'uncaughtExceptions.log',
      handleExceptions: false,
    })
  );

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(
    new winston.transports.File({
      filename: 'logfile.log',
      format: combine(label({ label: 'Dengine' }), timestamp(), myFormat),
    })
  );

  if (process.env.NODE_ENV !== 'production') {
    winston.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }
}

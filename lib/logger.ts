import winston from 'winston';

function dateFormat() {
  return (new Date()).toLocaleString('br-SP', {timeZone: 'America/Sao_Paulo'});
}

const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  defaultMeta: {
    time: dateFormat(),
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
          winston.format.colorize(),
          winston.format.errors(),
          winston.format.simple(),
      ),
    }),
  ],
});

logger.debug(JSON.stringify(winston.config.syslog.levels));

export default logger;

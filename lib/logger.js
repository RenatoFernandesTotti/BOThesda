function dateFormat() {
  return (new Date).toLocaleString('br-SP')
}



const winston = require('winston');
logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  defaultMeta: {
    time: dateFormat()
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      )
    })
  ],
});

logger.debug(JSON.stringify(winston.config.syslog.levels))


module.exports = logger;
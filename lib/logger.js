function dateFormat() {
    let date = new Date
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}


const winston = require('winston');
logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  defaultMeta: { time: dateFormat() },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      )
    })
  ],
});


module.exports=logger;
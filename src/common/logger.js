const winston = require('winston');
const {combine, timestamp, label, printf} = winston.format;

function concatArgs(...args) {
  return args.reduce((prev, cur) => {
    return JSON.stringify(prev) + ' ' + JSON.stringify(cur);
  });
}

function wrapLogMethod(logger, method) {
  return (...args) => logger[method](concatArgs(...args))
}

function wrap(logger) {
  return {
    debug: wrapLogMethod(logger, 'debug'),
    info: wrapLogMethod(logger, 'info'),
    warn: wrapLogMethod(logger, 'warn'),
    error: wrapLogMethod(logger, 'error')
  }
}

function getLogger(name) {
  const defaultFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });

  let logger = winston.createLogger({
    level: 'debug',
    format: combine(
      label({label: name}),
      timestamp(),
      defaultFormat
    ),
    transports: [new winston.transports.Console()]
  });

  return wrap(logger);
}

module.exports = {
  getLogger
};

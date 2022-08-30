import log4js from "log4js";

log4js.configure({
  appenders: {
    consola: { type: "console" },
    archivoInfo: { type: "file", filename: "logs/info.log" },
    archivoWarn: { type: "file", filename: "logs/warn.log" },
    archivoError: { type: "file", filename: "logs/error.log" },
    soloInfo: {type: 'logLevelFilter', appender: 'archivoInfo', level: 'info'},
    soloWarn: {type: 'logLevelFilter', appender: 'archivoWarn', level: 'warn'},
    soloError: {type: 'logLevelFilter', appender: 'ArchivoError', level: 'error'}
  },
  categories: {
    default: { appenders: ["consola"], level: "trace" },
    desarrollo: {appenders: ['consola'], level: 'info'},
    produccion: {appenders: ['soloInfo', 'soloWarn', 'soloError'], level: 'info'}
  }
});

const logAUtilizar = process.env.NODE_ENV === 'PROD' ? 'produccion' : 'desarrollo';

export default log4js.getLogger(logAUtilizar);
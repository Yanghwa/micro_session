const axios = require('axios')

const logServer = axios.create({
  baseURL: "http://localhost:4003"
})

const loggerUrl = "log"

const LOGLEVEL_TRACE = 1
const LOGLEVEL_DEBUG = 2
const LOGLEVEL_INFO = 3
const LOGLEVEL_WARNING = 4
const LOGLEVEL_ERROR = 5

// time, level, msg
const errorHandler = (error) => {
  console.log(error.toJSON())
}

let sourceName = "UNUSIGNED"
let sourcePort = -1

const postLog = (prefix, logLevel, logMessage) => {
  const stacktraceObject = {}
  Error.captureStackTrace(stacktraceObject)
  console.log(stacktraceObject)

  let content = {
    logTime: new Date().getTime(),
    prefix: prefix,
    name: sourceName,
    port: sourcePort,
    logLevel: logLevel,
    logMessage: logMessage,
    stacktrace: stacktraceObject
  }
  logServer.post(loggerUrl, content).catch(errorHandler) 
}


let loggerObject = {
  trace: (prefix, logMessage) => { 
    postLog(prefix, LOGLEVEL_TRACE, logMessage)
  },
  debug: (prefix, logMessage) => { 
    postLog(prefix, LOGLEVEL_DEBUG, logMessage)
  },
  info: (prefix, logMessage) => { 
    postLog(prefix, LOGLEVEL_INFO, logMessage)
  },
  warning: (prefix, logMessage) => { 
    postLog(prefix, LOGLEVEL_WARNING, logMessage)
  },
  error: (prefix, logMessage) => { 
    postLog(prefix, LOGLEVEL_ERROR, logMessage)
  },
  setSource: (name, port) => {
    sourceName = name
    sourcePort = port
  }
}


module.exports = loggerObject

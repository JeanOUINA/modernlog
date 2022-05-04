const Logger = require("./dist/Logger")

Logger.log("test log")
Logger.warn("test warn")
Logger.error("test error")
Logger.info("test info")

console.log("Patching console...")
Logger.patch()

console.log("test console log")
console.warn("test console warn")
console.error("test console error")
console.info("test console info")

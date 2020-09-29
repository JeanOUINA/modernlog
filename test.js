const Logger = require("./dist/Logger")

Logger.log("test log")
Logger.warn("test warn")
Logger.error("test error")
Logger.info("Test Info")

console.log("Patching console...")
Logger.patch()
console.log("Test console")
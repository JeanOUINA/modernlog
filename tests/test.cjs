const Logger = require("../dist/autopatch.js")

Logger.log("logger.log");
Logger.info("logger.info");
Logger.warn("logger.warn");
Logger.error("logger.error");

console.log("console.log");

Logger.info("Unpatching console...");
Logger.unpatch();

Logger.log("logger.log");
console.log("console.log");

Logger.info("Re-patching console...");
Logger.patch();

Logger.log("logger.log");
console.log("console.log");
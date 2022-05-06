import { instead } from "spitroast";

type LogType = "log" | "error" | "info" | "warn";

const symbols = process.platform === "win32" ? {
	log: "√ ",
	error: "× ",
	info: "i ",
	warn: "‼ "
} : {
	log: "✔ ",
	error: "✖ ",
	info: "ℹ ",
	warn: "⚠ "
}

const colors = {
	log: 32,
	error: 31,
	info: 34,
	warn: 33
}

function getStackFileName() {
	const stack = new Error().stack.split(/[\n\r]+/g).map(e => e.trim());

	return stack.reverse().find(e => !e.includes("node:"));
}

function getLogPrefix(type: LogType): string[] {
	const date = new Date();
	let color = colors[type];
	let emoji = symbols[type];

	const datestr = `${("0"+date.getHours()).slice(-2)}:${("0"+date.getMinutes()).slice(-2)}:${("0"+date.getSeconds()).slice(-2)} ${("0"+(date.getMonth()+1)).slice(-2)}/${("0"+date.getDate()).slice(-2)}/${date.getFullYear()}`;

	return [`[\x1b[35m${datestr}\x1b[0m]`, `[\x1b[${color}m${emoji}${type.toUpperCase()}\x1b[0m]`];
}

function getLogSuffix() {
	let suffix = [];

	if(!options.ignoreOptions) {
		if(options.filename) {
			suffix.push("\n", getStackFileName());
		}
		 
		if(options.extraSpaces > 0) {
			suffix.push("\n".repeat(options.extraSpaces));
		}
	}

	return suffix;
}

function onExit(code: number) {
	if(typeof code !== "number") throw new TypeError("`code` argument should be a number.");

	const logger = code === 0 ? console.warn : console.error;

	if(options.ignoreOptions) {
		logger(`Exiting with code ${code}.`);
	} else {
		options.ignoreOptions = true
		logger(`Exiting with code ${code}.`);
		options.ignoreOptions = false
	}
}

const logTypes: LogType[] = [ "log", "info", "warn", "error" ];
let patches: Function[] = [];
export function patch() {
	if(patches.length === 0) {
		for(let logType of logTypes) {
			patches[patches.length] = instead(logType, console, (args: string[], originalFunction: Function) => {
				return originalFunction(...getLogPrefix(logType), ...args, ...getLogSuffix());
			});
		}
	
		process.on("exit", onExit);
		patches[patches.length] = () => process.removeListener("exit", onExit);

		return true;
	} else {
		return false;
	}
}

export function unpatch(): Boolean {
	if(patches.length !== 0) {
		while(patches.length > 0) {
			let unpatchThisPatch = patches.shift();
			unpatchThisPatch();
		}
	
		return true;
	} else {
		return false;
	}
}

const customLog = (type: LogType, ...args: string[]) => patches.length > 0 ? console[type](...args) : console[type](...getLogPrefix(type), ...args, ...getLogSuffix());
export const log = (...args: string[]) => customLog("log", ...args);
export const info = (...args: string[]) => customLog("info", ...args);
export const warn = (...args: string[]) => customLog("warn", ...args);
export const error = (...args: string[]) => customLog("error", ...args);

export const options = {
	filename: false,
	extraSpaces: 0,

	ignoreOptions: false
}
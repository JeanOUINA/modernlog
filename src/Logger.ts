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

function getStackFileName(){
	const stack = new Error().stack.split(/[\n\r]+/g).map(e => e.trim());
	let line = stack.filter(e => !e.startsWith("-> "))[3];
	const index = stack.findIndex(e => e === line);
	if(index !== 3){ // stacktrace
		line += "\n    "+stack[index+1];
	}

	return line;
}

function getLogPrefix(type: LogType): string[] {
	const date = new Date();
	let color = colors[type];
	let emoji = symbols[type];

	const datestr = `${("0"+date.getHours()).slice(-2)}:${("0"+date.getMinutes()).slice(-2)}:${("0"+date.getSeconds()).slice(-2)} ${("0"+(date.getMonth()+1)).slice(-2)}/${("0"+date.getDate()).slice(-2)}/${date.getFullYear()}`;
	let logs = [`[\x1b[35m${datestr}\x1b[0m] [\x1b[${color}m${emoji}${type.toUpperCase()}\x1b[0m]`];

	if(options.filename) logs.push("\n", getStackFileName());

	return logs;
}

function onExit(code: number) {
	if(typeof code !== "number") throw new TypeError("`code` argument should be a number.")
	const filename = options.filename
	options.filename = false
	;(code === 0 ? console.warn : console.error)(`Exiting with code ${code}.`)
	options.filename = filename
}

let patches: Function[] = [];
export function patch() {
	if(patches.length === 0) {
		for(let logType of [ "log", "info", "warn", "error" ]) {
			patches[patches.length] = instead(logType, console, (args: string[], originalFunction: Function) => {
				return originalFunction(...getLogPrefix(logType as LogType), ...args);
			});
		}
	
		let exitListener = process.on("exit", onExit);

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

export const options = {
	filename: false
}

const customLog = (type: LogType, ...args: string[]) => {
	return patches.length > 0 ? console[type](...args) : console[type](...getLogPrefix(type), ...args);
}

export const log = (...args: string[]) => customLog("log", ...args);
export const info = (...args: string[]) => customLog("info", ...args);
export const warn = (...args: string[]) => customLog("warn", ...args);
export const error = (...args: string[]) => customLog("error", ...args);
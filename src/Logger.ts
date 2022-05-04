let isConsolePatched = false
export function patch(){
    if(isConsolePatched)return false
    isConsolePatched = true
    console.log = log
    console.warn = warn
    console.info = info
    console.error = error
    process.on("exit", code => {
        if(typeof code !== "number")throw new TypeError("`code` argument should be a number.")
        const filename = options.filename
        options.filename = false
        ;(code === 0 ? warn : error)(`Exiting with code ${code}.`)
        options.filename = filename
    })
    return true
}

export const options = {
    filename: false
}

export function exit(code?:number){
    return process.exit(code)
}

const consoleLog = console.log
export function log(...args: any[]):void{
    const logs = [getStartLog("log"), ...args]
    if(options.filename){
        logs.push("\n", getStackFileName())
    }
    consoleLog(...logs)
}
const consoleError = console.error
export function error(...args: any[]):void{
    const logs = [getStartLog("error"), ...args]
    if(options.filename){
        logs.push("\n", getStackFileName())
    }
    consoleError(...logs)
}
const consoleWarn = console.warn
export function warn(...args: any[]):void{
    const logs = [getStartLog("warn"), ...args]
    if(options.filename){
        logs.push("\n", getStackFileName())
    }
    consoleWarn(...logs)
}
const consoleInfo = console.info
export function info(...args: any[]):void{
    const logs = [getStartLog("info"), ...args]
    if(options.filename){
        logs.push("\n", getStackFileName())
    }
    consoleInfo(...logs)
}

export const original = {
    log: consoleLog,
    error: consoleError,
    info: consoleInfo,
    warn: consoleWarn
}

function getStackFileName(){
    const stack = new Error().stack.split(/[\n\r]+/g).map(e => e.trim())
    let line = stack.filter(e => !e.startsWith("-> "))[3]
    const index = stack.findIndex(e => e === line)
    if(index !== 3){ // stacktrace
        line += "\n    "+stack[index+1]
    }
    return line
}

function getStartLog(type: string):string{
    const date = new Date()
    let color = 0
    let emoji = ""
    if(type === "log"){
        color = 32
        emoji = Emojis.LOG
    }else if(type === "error"){
        color = 31
        emoji = Emojis.ERROR
    }else if(type === "info"){
        color = 34
        emoji = Emojis.INFO
    }else if(type === "warn"){
        color = 33
        emoji = Emojis.WARN
    }
    const datestr = `${("0"+date.getHours()).slice(-2)}:${("0"+date.getMinutes()).slice(-2)}:${("0"+date.getSeconds()).slice(-2)} ${("0"+(date.getMonth()+1)).slice(-2)}/${("0"+date.getDate()).slice(-2)}/${date.getFullYear()}`
    return `[\x1b[35m${datestr}\x1b[0m] [\x1b[${color}m${emoji}${type.toUpperCase()}\x1b[0m]`  
}

const emojis = process.platform === "win32" ? {
    info: "i ",
    success: "√ ",
    warning: "‼ ",
    error: "× "
} : {
    info: "ℹ ",
    success: "✔ ",
    warning: "⚠ ",
    error: "✖ "
}

const Emojis = {
    INFO: emojis.info,
    ERROR: emojis.error,
    LOG: emojis.success,
    WARN: emojis.warning
}
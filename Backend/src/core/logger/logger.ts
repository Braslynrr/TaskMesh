import pino from "pino"
import { getConfig } from "../config/config"

let logger: pino.Logger<never, boolean>

export function getLogger(): pino.Logger<never, boolean> {

    if (!logger) {
        const config = getConfig()
        const isProd = config.env === "production"
        let transport = undefined

        if (!isProd) {
            transport = {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    messageFormat: "{msg} {req.method} {req.url} {res.statusCode}",
                    ignore: "pid,hostname,req,res"
                }
            }
        }

        logger = pino({
            level: isProd ? "info" : "debug",
            redact: {
                paths: ["req.headers.cookie",
                    "req.body.password",
                ]
            },
            transport: transport
        })
    }

    return logger
}

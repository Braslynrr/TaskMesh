import http from 'http'
import app from '../../app'
import { initSocket } from '../../modules/Socket/socket.server'

let server:http.Server = null

export function getServer() {
    if (!server) {
        server = http.createServer(app)
        initSocket(server)
    }
    return server
}
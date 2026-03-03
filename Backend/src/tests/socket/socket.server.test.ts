import { io as Client } from "socket.io-client"
import { getIO } from "../../modules/Socket/socket.server"
import { SocketEvents } from "../../modules/Socket/socket.events"
import { getServer } from "../factories/server.factory"

describe("Socket.io connection", () => {
  let server: any
  let port: number

  beforeAll(async () => {
    server = getServer()

    await new Promise<void>((resolve) => {
      server.listen(() => {
        port = (server.address() as any).port
        resolve()
      })
    })
  })

  afterAll((done) => {
    server.close(done)
  })

  it("should connect successfully", (done) => {
    const client = Client(`http://localhost:${port}`)

    client.on(SocketEvents.CONNECT, () => {
      expect(client.connected).toBe(true)
      client.disconnect()
      done()
    })

    client.on(SocketEvents.CONNECT_ERROR, (err) => {
      done(err)
    })
  })

  it("should join a room", async () => {
    const client = Client(`http://localhost:${port}`)

    await new Promise<void>((resolve) => {
      client.on(SocketEvents.CONNECT, resolve)
    })

    expect(client.connected).toBe(true)

    client.emit(SocketEvents.JOIN_TASKBOARD, "1")

    // Esperar a que el servidor procese
    await new Promise((resolve) => setTimeout(resolve, 50))

    const ioServer = await getIO()
    const sockets = await ioServer.in(`${SocketEvents.TASKBOARD}:1`).fetchSockets()

    expect(sockets.length).toBe(1)

    client.disconnect()
  })
})
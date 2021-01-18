import * as express from "express"
import {Server} from "http"
import {config} from "dotenv"
import {Server as SocketServer, Socket} from "socket.io";
import {authenticate} from "./api";

config()

const {
    WEB_PORT
} = process.env

const app = express()
const http = new Server(app)
const io = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
}) as SocketServer

io.on("connection", (socket: Socket) => {
    console.log("Socket Connected")

    socket.on("authenticate", code => authenticate(socket, code))
})

http.listen(WEB_PORT, () => {
    console.log("Web Server Running")
})
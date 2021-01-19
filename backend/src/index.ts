import * as express from "express"
import {Server} from "http"
import {config} from "dotenv"
import {Server as SocketServer, Socket} from "socket.io";
import api from "./api";
import {Client} from "discord.js";
import {setGuild} from "./guild";
import * as mongoose from "mongoose";

config()

const {
    BOT_TOKEN
} = process.env

mongoose.connect("mongodb://localhost:27017/school", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DB Connected!")
})

const app = express()
const http = new Server(app)
const io = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
}) as SocketServer
const bot = new Client()

app.use(require("body-parser").json())
app.use(require("cors")())
app.use("/api", api)

io.on("connection", (socket: Socket) => {
    console.log("Socket Connected")
})

bot.on('ready', async () => {
    console.log("Bot Connected!")
    await setGuild(bot)
})

http.listen(8000, () => {
    console.log("Web Server Running")
})

bot.login(BOT_TOKEN)
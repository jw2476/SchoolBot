import * as express from "express"
import {Server} from "http"
import {config} from "dotenv"
import {Server as SocketServer, Socket} from "socket.io";
import api from "./api";
import {Client} from "discord.js";
import {setGuild} from "./guild";
import * as mongoose from "mongoose";
import Student from "./models/student";

config()

const {
    BOT_TOKEN,
    WEB_PORT,
    DB_URI
} = process.env

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
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

bot.on('guildMemberAdd', async member => {
    await new Student({
        id: member.user.id
    }).save()
})

http.listen(WEB_PORT, () => {
    console.log(`Web Server Running on port ${WEB_PORT}`)
})

bot.login(BOT_TOKEN)
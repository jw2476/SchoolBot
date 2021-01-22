import * as express from "express"
import * as http from "http"
import {config} from "dotenv"
import {Server as SocketServer, Socket} from "socket.io";
import api from "./api";
import {Client} from "discord.js";
import {setGuild} from "./guild";
import * as mongoose from "mongoose";
import Student from "./models/student";
import * as fs from "fs";
import * as https from "https";

config()

const {
    BOT_TOKEN,
    WEB_PORT,
    DB_URI,
    HTTPS
} = process.env

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DB Connected!")
})

const app = express()
let web

if (HTTPS === "true") {
    const key = fs.readFileSync(__dirname + "/../selfsigned.key")
    const cert = fs.readFileSync(__dirname + "/../selfsigned.crt")
    const options = {
        key,
        cert
    }

    web = https.createServer(options, app)
} else {
    web = http.createServer(app)
}

const io = require("socket.io")(web, {
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

web.listen(WEB_PORT, () => {
    console.log(`Web Server Running on port ${WEB_PORT}`)
})

bot.login(BOT_TOKEN)
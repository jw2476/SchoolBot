import {Socket} from "socket.io";
import axios from "axios"
import {config} from "dotenv";

config()

const {
    CLIENT_ID,
    CLIENT_SECRET
} = process.env

export async function authenticate(socket: Socket, code: string) {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://localhost:5000",
        scope: "identify"
    })

    const token = await axios.post("https://discord.com/api/oauth2/token", params).then(res => res.data.access_token as string).catch(err => {console.error(err); return})

    console.log(token)

    if (!token) {
        socket.emit("authenticateError", "Bad Code")
    } else {
        socket.emit("authenticateSuccess", {
            token
        })
    }
}
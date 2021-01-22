import {Socket} from "socket.io";
import axios from "axios"
import {config} from "dotenv";
import { User } from "discord.js";
import {Request, Response} from "express";

config()

const {
    CLIENT_ID,
    CLIENT_SECRET
} = process.env

export async function auth(req: Request, res: Response) {
    const code = req.body.code
    const uri = req.body.uri

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: uri,
        scope: "identify"
    })

    const token = await axios.post("https://discord.com/api/oauth2/token", params).then(res => res.data.access_token as string).catch(err => {console.error(err); return})

    console.log(token)

    if (!token) {
        res.json({
            error: "Bad Code"
        })
        return
    }

    const headers = {
        Authorization: `Bearer ${token}`
    }

    const user = await axios.get("https://discord.com/api/users/@me", {headers}).then(res => res.data as User).catch(err => {console.error(err); return})

    if (!user) {
        res.json({
            error: "No User"
        })
    } else {
        res.json({
            token,
            user
        })
    }
}
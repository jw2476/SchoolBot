import {Client, Guild} from "discord.js";
import {config} from "dotenv";

config()

const {
    GUILD_ID
} = process.env

let guild: Guild

export async function setGuild(client: Client) {
    guild = await client.guilds.fetch(GUILD_ID)
}

export default () => guild
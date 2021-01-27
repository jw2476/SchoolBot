import {Request, Response} from "express";
import Classroom from "../../models/classroom";
import guild from "../../guild";
import {CategoryChannel} from "discord.js";

export default async (req: Request, res: Response) => {
    const id = req.params.id

    const classroom = await Classroom.findOne({_id: id})

    if (!classroom) {
        res.json({
            error: "No classroom with that ID"
        })
        return
    }

    const category = guild().channels.resolve(classroom.category) as CategoryChannel

    const tables = category.children.filter(channel => channel.name.startsWith("Table"))

    for (const table of tables.values()) {
        for (const member of table.members.values()) {
            await member.voice.setChannel(classroom.mainVC)
        }
        await table.delete()
    }

    res.json({
        success: true
    })
}
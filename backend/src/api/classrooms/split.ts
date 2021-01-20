import {Request, Response} from "express";
import Classroom from "../../models/classroom";
import guild from "../../guild";
import {CategoryChannel, VoiceChannel} from "discord.js";

export default async (req: Request, res: Response) => {
    const id = req.params.id
    const amount = req.body.amount

    const classroom = await Classroom.findOne({_id: id})

    if (!classroom) {
        res.json({
            error: "No classroom with that ID"
        })
        return
    }

    const channels: Array<VoiceChannel> = []

    for (let i = 0; i < amount; i++) {
        const channel = await guild().channels.create(`Table ${i+1}`, {
            type: "voice",
            parent: classroom.category
        })
        channels.push(channel)
    }

    const mainVC = guild().channels.resolve(classroom.mainVC)

    let i = 0

    mainVC.members.forEach(member => {
        i++
        member.voice.setChannel(channels[i % channels.length])
    })

    res.json({
        success: true
    })
}
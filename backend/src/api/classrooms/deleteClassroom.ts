import {Request, Response} from "express";
import Classroom from "../../models/classroom";
import guild from "../../guild";
import {CategoryChannel} from "discord.js";

export default async (req: Request, res: Response) => {
    const id = req.params.id

    const classroom = await Classroom.findOne({_id: id})

    if (!classroom) {
        res.json({
            error: "No Classroom with that Code"
        })
        return
    }

    const category = await guild().channels.resolve(classroom.category) as CategoryChannel
    const studentRole = await guild().roles.resolve(classroom.studentRole)
    const teacherRole = await guild().roles.resolve(classroom.teacherRole)

    await Promise.all(category.children.map(channel => channel.delete()))
    await category.delete()

    await studentRole.delete()
    await teacherRole.delete()

    await classroom.deleteOne()

    res.json({
        success: true
    })
}
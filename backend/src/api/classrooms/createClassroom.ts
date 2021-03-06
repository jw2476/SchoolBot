import {Request, Response} from "express";
import Classroom from "../../models/classroom";
import Teacher, {ITeacher} from "../../models/teacher";
import getGuild from "../../guild"

export default async function (req: Request, res: Response) {
    const code = req.query.code.toString()
    const id = req.query.id.toString()
    const guild = getGuild()

    const existingClassroom = await Classroom.findOne({code: code.toLowerCase()})

    if (existingClassroom) {
        res.json({
            error: "Existing classroom with that code"
        })
        return;
    }

    const user = await guild.members.fetch(id)

    const teacher = await Teacher.findOne({id: id}, (err, teacher) => {
        if (err) {console.error(err); return}
        return teacher
    })

    if (!teacher) {
        res.json({
            error: "You are not a teacher"
        })
        return
    }

    const teacherRole = await guild.roles.create({
        data: {
            name: `${code} (Teacher)`,
            color: "BLUE"
        }
    })

    const studentRole = await guild.roles.create({
        data: {
            name: `${code} (Student)`,
            color: "GREEN"
        }
    })

    await user.roles.add(teacherRole)

    const category = await guild.channels.create(code, {
        type: "category",
        permissionOverwrites: [
            {
                id: teacherRole,
                allow: "VIEW_CHANNEL"
            },
            {
                id: studentRole,
                allow: "VIEW_CHANNEL"
            },
            {
                id: guild.roles.everyone,
                deny: "VIEW_CHANNEL"
            }
        ]
    })

    const mainVC = await guild.channels.create("Classroom", {
        type: "voice",
        parent: category
    })

    const chat = await guild.channels.create("chat", {
        type: "text",
        parent: category
    })

    const classroom = await new Classroom({
        category: category.id,
        mainVC: mainVC.id,
        chat: chat.id,
        students: [],
        teachers: [teacher._id],
        code: code.toLowerCase(),
        teacherRole: teacherRole.id,
        studentRole: studentRole.id
    }).save()

    teacher.classrooms.push(classroom._id)
    await teacher.save()

    res.json({
        classroom
    })
}
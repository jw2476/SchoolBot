import {Request, Response} from "express";
import Student from "../../models/student";
import login from "../../edulink/login";
import getTimetable from "../../edulink/getTimetable";
import Classroom from "../../models/classroom";
import guild from "../../guild";

export default async (req: Request, res: Response) => {
    const id = req.params.id

    const student = await Student.findOne({id: id}, (err, student) => {
        if (err) {
            console.error(err);
            return
        }
        return student
    })

    const user = await guild().members.fetch(id)

    console.log(student)

    if (!student) {
        res.json({
            error: "Not a student"
        })
        return
    }

    const {
        username,
        password
    } = req.body

    const loginResult = await login(username, password)

    if (!loginResult || !loginResult.authtoken) {
        res.json({
            error: "Auth wrong"
        })
        return
    }

    const timetable = await getTimetable(loginResult.authtoken, loginResult.user.id)

    const codes = []

    for (const week of timetable.weeks) {
        for (const day of week.days) {
            for (const lesson of day.lessons) {
                if (!codes.includes(lesson.teaching_group.name.toLowerCase())) codes.push(lesson.teaching_group.name.toLowerCase())
            }
        }
    }

    for (const code of codes) {
        const classroom = await Classroom.findOne({code}, (err, classroom) => {
            if (err) {console.error(err); return}
            return classroom
        })

        if (classroom && !classroom.students.includes(student._id)) {
            classroom.students.push(student._id)
            student.classrooms.push(classroom._id)

            await classroom.save()
            await student.save()

            await user.roles.add(classroom.studentRole)
        }
    }

    res.json({
        success: true
    })
}
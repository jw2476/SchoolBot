import {Request, Response} from "express";
import Classroom from "../../models/classroom";
import Teacher from "../../models/teacher";
import "../../models/student"

export default async (req: Request, res: Response) => {
    const id = req.params.id

    const teacher = await Teacher.findOne({id: id}, (err, teacher) => {
        if (err) {console.error(err); return}
        return teacher
    })

    if (!teacher) {
        res.json({
            error: "Not a teacher"
        })
        return
    }

    let classrooms = await Classroom.find({teachers: teacher._id}, (err, classrooms) => {
        if (err) {console.error(err); return []}
        return classrooms
    })

    classrooms = await Promise.all(classrooms.map(classroom => classroom.populate("teachers").populate("students").execPopulate()))

    res.json(classrooms)
}
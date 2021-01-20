import {Request, Response} from "express";
import Classroom from "../../models/classroom";
import Teacher from "../../models/teacher";
import "../../models/student"
import Student from "../../models/student";

export default async (req: Request, res: Response) => {
    const id = req.params.id

    const student = await Student.findOne({id: id}, (err, student) => {
        if (err) {console.error(err); return}
        return student
    })

    if (!student) {
        res.json({
            error: "Not a student"
        })
        return
    }

    let classrooms = await Classroom.find({students: student._id}, (err, classrooms) => {
        if (err) {console.error(err); return []}
        return classrooms
    })

    classrooms = await Promise.all(classrooms.map(classroom => classroom.populate("teachers").populate("students").execPopulate()))

    res.json(classrooms)
}
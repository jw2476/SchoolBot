import {Request, Response} from "express";
import Student from "../models/student";
import Teacher from "../models/teacher";

export default async (req: Request, res: Response) => {
    const id = req.params.id

    const student = await Student.findOne({id: id}, (err, student) => {
        if (err) {
            console.error(err);
            return
        }
        return student
    })

    if (student) { res.send("student"); return }

    const teacher = await Teacher.findOne({id: id}, (err, teacher) => {
        if (err) {
            console.error(err);
            return
        }
        return teacher
    })

    if (teacher) { res.send("teacher"); return }
}
import {Request, Response} from "express";
import Student from "../models/student";
import Teacher from "../models/teacher";

export default async (req: Request, res: Response) => {
    const id = req.params.id

    const student = await Student.findOne({id: id})
    if (student) { res.send("student"); return }

    const teacher = await Teacher.findOne({id: id})
    if (teacher) { res.send("teacher"); return }

    res.send("")
}
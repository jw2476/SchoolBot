import {Document, model, Schema, Types} from "mongoose";
import {IStudent} from "./student";
import {ITeacher} from "./teacher";

export interface IClassroom extends Document {
    category: string,
    mainVC: string,
    chat: string,
    students: Array<IStudent>,
    teachers: Array<ITeacher>,
    code: string
}

const classroomSchema = new Schema({
    category: String,
    mainVC: String,
    chat: String,
    students: [{
        type: Types.ObjectId,
        ref: "Student"
    }],
    teachers: [{
        type: Types.ObjectId,
        ref: "Teacher"
    }],
    code: String
})

const Classroom = model<IClassroom>("Classroom", classroomSchema)

export default Classroom

import {Document, model, Schema, Types} from "mongoose";


export interface ITeacher extends Document {
    id: string,
    classrooms: [Types.ObjectId]
}

const teacherSchema = new Schema({
    id: String,
    classrooms: [{
        type: Types.ObjectId,
        ref: "Classroom"
    }]
})

const Teacher = model<ITeacher>("Teacher", teacherSchema)

export default Teacher
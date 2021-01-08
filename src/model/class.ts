import {Model, model, Schema, Document} from "mongoose";

interface ClassType extends Document {
    name: string,
    category: string,
    teacherRole: string,
    studentRole: string,
    host: string,
    mainVC: string,
    text: string,
    raisedHands: Array<string>
}

const classSchema = new Schema({
    name: String,
    category: String,
    teacherRole: String,
    studentRole: String,
    host: String,
    mainVC: String,
    text: String,
    raisedHands: [String]
})

export const Class: Model<ClassType> = model("Class", classSchema)
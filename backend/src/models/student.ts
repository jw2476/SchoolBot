import {Document, model, Schema, Types} from "mongoose";


export interface IStudent extends Document {
    id: string,
    classrooms: [Types.ObjectId],
    raisedHand: string,
}

const studentSchema = new Schema({
    id: String,
    classrooms: [{
        type: Types.ObjectId,
        ref: "Classroom"
    }],
    raisedHand: String
})

const Student = model<IStudent>("Student", studentSchema)

export default Student

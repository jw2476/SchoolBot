import base from "./base";

type Timetable = {
    weeks: [{
        days: [{
            lessons: [{
                teaching_group: {
                    name: string
                }
            }]
        }]
    }]
}

export default (token: string, learnerID: string): Promise<Timetable> => {
    const now = new Date()
    const date = `${now.getFullYear()}-${now.getMonth().toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`
    
    const params = {
        authtoken: token,
        learner_id: learnerID,
        date
    }

    return base("EduLink.Timetable", params)
}
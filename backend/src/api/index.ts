import {Router} from "express";
import {auth} from "./auth";
import createClassroom from "./createClassroom";
import teachers from "./teachers";
import getUserType from "./getUserType";
import students from "./students";

const router = Router()

router.get("/auth", auth)
router.post("/classrooms", createClassroom)
router.get("/:id/type", getUserType)

router.use("/students", students)
router.use("/teachers", teachers)


export default router
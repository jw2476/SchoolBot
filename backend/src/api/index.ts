import {Router} from "express";
import {auth} from "./auth";
import teachers from "./teachers";
import getUserType from "./getUserType";
import students from "./students";
import classrooms from "./classrooms";

const router = Router()

router.get("/auth", auth)
router.get("/:id/type", getUserType)

router.use("/classrooms", classrooms)
router.use("/students", students)
router.use("/teachers", teachers)


export default router
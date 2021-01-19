import {Router} from "express";
import { auth } from "./auth";
import classrooms from "./classrooms";
import createClassroom from "./createClassroom";
import teachers from "./teachers";

const router = Router()

router.get("/auth", auth)

router.get("/classrooms", createClassroom)

router.use("/teachers", teachers)

export default router
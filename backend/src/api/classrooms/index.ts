import {Router} from "express";
import createClassroom from "./createClassroom";
import deleteClassroom from "./deleteClassroom";

const router = Router()

router.post("/", createClassroom)
router.delete("/:id", deleteClassroom)

export default router
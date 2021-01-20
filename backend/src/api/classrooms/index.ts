import {Router} from "express";
import createClassroom from "./createClassroom";
import deleteClassroom from "./deleteClassroom";
import split from "./split";
import merge from "./merge";

const router = Router()

router.post("/", createClassroom)
router.delete("/:id", deleteClassroom)
router.post("/:id/split", split)
router.post("/:id/merge", merge)

export default router
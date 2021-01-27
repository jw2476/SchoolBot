import {Router} from "express";
import joinClassrooms from "./joinClassrooms";
import getName from "./getName";
import getClassrooms from "./getClassrooms";

const router = Router()

router.post("/:id/joinClassrooms", joinClassrooms)
router.get("/:id/name", getName)
router.get("/:id/classrooms", getClassrooms)

export default router
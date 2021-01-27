import {Router} from "express";
import getClassrooms from "./getClassrooms";

const router = Router()

router.get("/:id/classrooms", getClassrooms)

export default router
import {Router} from "express";
import joinClassrooms from "./joinClassrooms";
import getName from "./getName";

const router = Router()

router.post("/:id/joinClassrooms", joinClassrooms)
router.get("/:id/name", getName)

export default router
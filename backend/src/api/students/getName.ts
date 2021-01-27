import {Request, Response} from "express";
import guild from "../../guild";

export default async (req: Request, res: Response) => {
    const id = req.params.id
    const member = await guild().members.fetch(id)

    res.send(member.displayName)
}
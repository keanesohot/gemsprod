import express, { Request, Response } from "express";
import { regis_guest, findGuestById, getAllGuests, getGuestById } from "../service/guest.service";
import jwt from "jsonwebtoken";

export const createGuest = async function (req: Request, res: Response){
    const { name } = req.body;
    try {
        const token = await regis_guest({ name });
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const guestRoleController = async function (req: Request, res: Response) {
    const token = req.header("x-auth-token");
    const key = process.env.TOKEN_KEY || "kimandfamily";
    if (!token)
        return res.status(401).json({ msg: "No auth token, access denied" });

    try {
        const extractToken = jwt.verify(token, key) as { id: string, role: string };
        const guest = await findGuestById(extractToken.id);
    
        if (!guest) {
            return res.status(500).send(null);
        }
    
        const token_guestinfo = jwt.sign({ "name": guest.name, "role": "guest" }, key);
        return res.status(200).send(token_guestinfo);
    } catch (error) {
        return res.status(401).json({ msg: "Token verification failed, authorization denied." });
    }

};

export const getGuests = async function (req: Request, res: Response) {
    try {
        const guests = await getAllGuests();
        res.status(200).json({ data: guests });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getGuestByIdController = async function (req: Request, res: Response) {
    const id = req.params.id;
    try {
        const guest = await getGuestById(id);
        res.status(200).json({ data: guest });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
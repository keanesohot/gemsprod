import express, { Request, Response } from "express";
import { auth } from "../service/auth.service";
import jwt from "jsonwebtoken";
import { addActivityBasedOnWaitingList, findTotalUsers, findUserById } from "../service/user.service";
import { parseJwt } from "../service/auth.service";

export const userRolecontroller = async function (req: Request, res: Response) {
  const token = req.header("x-auth-token");
  const key = process.env.FONTENDURL || "kimandfamily";
  if (!token)
    return res.status(401).json({ msg: "No auth token, access denied" });

  const extractToken = parseJwt(token);

  const user = await findUserById(extractToken.id);
  
  if (!user) {
    return res.status(500).send(null);
  }
  
  const token_userinfo = jwt.sign({"email":user.email,"name":user.name,"role":user.role}, key);
  return res.status(200).send(token_userinfo);
};

export const getTotalUsers = async (req: Request, res: Response): Promise<void> => {
  try {
      const totalUsers = await findTotalUsers();
      res.status(200).json({ totalUsers });
  } catch (error) {
      console.error('Error in getTotalUsers controller:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};



// activity controller
export const addActivity = async (req: Request, res: Response) => {
  try {
    const { email, location, stationMarker, time, route, destinationMarker, stationId } = req.body;

    // Call the service to handle activity addition
    const result = await addActivityBasedOnWaitingList(
      { email, location, stationMarker, time, route, destinationMarker },
      stationId
    );

    if (result.status === "Error") {
      return res.status(400).json({ message: result.message });
    }

    return res.status(201).json({ message: result.message, data: result.data || null });
  } catch (error) {
    console.error("Error in addActivity controller:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
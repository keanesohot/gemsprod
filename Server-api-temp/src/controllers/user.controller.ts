import express, { Request, Response } from "express";
import { auth } from "../service/auth.service";
import jwt from "jsonwebtoken";
import { editUser, findAllUser, addActivityBasedOnWaitingList, findTotalUsers, findUserById, regis_user } from "../service/user.service";
import { parseJwt } from "../service/auth.service";
import { interface_editUser, interface_User } from "../interface/user.interface";
import { Types } from "mongoose";

export const userRolecontroller = async function (req: Request, res: Response) {
  const token = req.header("x-auth-token");
  const key = process.env.FONTENDURL || "kimandfamily";
  if (!token)
    return res.status(401).json({ msg: "No auth token, access denied" });

  const extractToken =  parseJwt(token);

  const user = await findUserById(extractToken.id);
  
  if (!user) {
    return res.status(500).send(null);
  }
  
  const token_userinfo = jwt.sign({
    "email":user.email,
    "name":user.name,
    "role":user.role,
    "picture":user.picture // เพิ่มรูปโปรไฟล์ใน payload
  }, key);
  return res.status(200).send(token_userinfo);
};

export const addStaffcontroller = async function (req: Request, res: Response) {
  const body:{email:string,name:string,role:string,id:string} = req.body;
  body.role = "STAFF";
  const {token,newUser,id} = await regis_user(body);
  if (newUser) {
    return res.status(200).send(`Added ${body.email} as STAFF`);
  }
  body.id = id;
  const {message,success} = await editUser({id:body.id,role:body.role});
  if (success) {
    return res.status(200).send(`Chaged ${body.email} role to STAFF`);
  }
  return res.status(400).send(message);
}

export const getStaffcontroller = async function (req: Request, res: Response) {
  const staffs = await findAllUser("STAFF");
  return res.status(200).send(staffs); 
}

export const editStaffcontroller = async function (req: Request, res: Response) {
  const body:interface_editUser = req.body;
  const {message,success} = await editUser(body);
  if (success) {
    return res.status(200).send(message);
  }
  return res.status(400).send(message);
}
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
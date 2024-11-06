import express, { Request, Response } from "express";
import { auth } from "../service/auth.service";
import jwt from "jsonwebtoken";
import { editUser, findAllUser, findUserById, regis_user } from "../service/user.service";
import { parseJwt } from "../service/auth.service";
import { interface_editUser, interface_User } from "../interface/user.interface";

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

export const addStaffcontroller = async function (req: Request, res: Response) {
  const body:{email:string,name:string,role:string} = req.body;
  body.role = "STAFF";
  const {token,newUser} = await regis_user(body);
  if (newUser) {
    return res.status(200).send(token);
  }
  return res.status(400).send('User already exist');
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
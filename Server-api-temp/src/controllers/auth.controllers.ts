import express, { Request, Response } from "express";
import { auth } from '../service/auth.service';
import jwt from "jsonwebtoken";
import { findUserbyEmail, regis_user } from "../service/user.service";
import { interface_User } from "../interface/user.interface";
import RoleModel from "../models/roles.model";

export const auth_controller = async (req:Request,res:Response)=>{
    const { code } = req.body;
    const userDetails = await auth(code);
    let role = "USER";
    if (userDetails.email === process.env.SUPERADMIN && process.env.SUPERADMIN !== undefined ) {
        role = "ADMIN";
    }
    const {data,message,success} =  await findUserbyEmail(userDetails.email);
    if (success && data !== undefined && data.role === "STAFF") {
        role = "STAFF"
    }
    const user: interface_User = {
        email:userDetails.email,
        name:userDetails.name,
        role:role
    };
    
    const {token,newUser} = await regis_user(user);
    res.status(200).send(token);
}
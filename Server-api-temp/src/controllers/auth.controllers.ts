import express, { Request, Response } from "express";
import { auth, getUserInfoFromToken } from '../service/auth.service';
import jwt from "jsonwebtoken";
import { findUserbyEmail, regis_user } from "../service/user.service";
import { interface_User } from "../interface/user.interface";
import RoleModel from "../models/roles.model";

export const auth_controller = async (req:Request,res:Response)=>{
    try {
        const { code, access_token, redirect_uri, flow_type } = req.body;
        
        // ถ้าเป็น implicit flow ให้ใช้ access token โดยตรง
        if (flow_type === "implicit") {
            if (!access_token) {
                return res.status(400).json({ error: "Missing access_token" });
            }
            // access_token ในที่นี้คือ Google access token
            const userDetails = await getUserInfoFromToken(access_token);
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
            return;
        }
        
        // Auth code flow (เดิม)
        if (!code) {
            return res.status(400).json({ error: "Missing code" });
        }
        const userDetails = await auth(code, redirect_uri);
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
    } catch (err: any) {
        console.error("auth_controller error:", err);
        if (err.response && err.response.data && err.response.data.error) {
            return res.status(400).json({
                error: err.response.data.error,
                error_description: err.response.data.error_description || undefined,
                detail: err.response.data
            });
        }
        if (err.error) {
            return res.status(400).json(err);
        }
        // ส่งรายละเอียด error อื่นๆ กลับไปด้วย
        return res.status(500).json({
            error: "Internal server error",
            message: err.message || err.toString(),
            stack: err.stack || undefined,
            detail: err
        });
    }
}
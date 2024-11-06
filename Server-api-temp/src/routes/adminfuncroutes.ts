import express from "express";
const userroute = express.Router();

import { addStaffcontroller, editStaffcontroller, getStaffcontroller } from "../controllers/user.controller";
import { admin_middleware } from "../middle/auth";

userroute.post("/addstaff",admin_middleware, addStaffcontroller);
userroute.get("/getstaff",admin_middleware, getStaffcontroller);
userroute.put("/editstaff",admin_middleware, editStaffcontroller);
export default userroute;
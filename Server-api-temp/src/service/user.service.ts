import User from "../models/users.model";
import jwt from 'jsonwebtoken';
import RoleModel from '../models/roles.model'; // Adjust the path as per your file structure
import { interface_User } from "../interface/user.interface";
import Activity from "../models/activity_model";
import Station from "../models/station_model";
import mongoose from "mongoose";

export const regis_user = async (payload:interface_User)=>{
    try {
        const key = process.env.TOKEN_KEY || "kimandfamily";
        // find user in database
        const user = await User.findOne({ email: payload.email });
        console.log("User found:", user);

        let token = "";
        // add role
        const roleindatabase = await addRole(payload.role);

        // console.log(roleindatabase.Role);
        if (!user) {
          // creat user
          const newuser = await User.create({
            email: payload.email,
            name: payload.name,
            role:roleindatabase.Role
          });
    
          console.log("New user created:", newuser);
           token = jwt.sign({ id: newuser._id }, key);
          return token;
        }
    
        if (user.role === undefined || user.role === null ) {
            user.updateOne({role:payload.role});
        }

         token = jwt.sign({ id: user._id }, key);

         return token;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
} 

export const addRole = async (roleName: string) => {
    try {
        // Check if the role already exists
        const existingRole = await RoleModel.findOne({ Role: roleName });

        if (existingRole) {
            console.log(`Role '${roleName}' already exists.`);
            return existingRole;
        }

        // Create the new role
        const newRole = await RoleModel.create({ Role: roleName });

        console.log(`Added new role: '${roleName}'`);
        return newRole;
    } catch (error) {
        console.error('Error adding role:', error);
        throw error;
    }
};

export const findRoleByName = async (roleName: any) => {
    try {
        const role = await RoleModel.findOne({ Role: roleName });
        if (role === null) {
            throw new Error('Role not found');
        }
        return role;
    } catch (error) {
        console.error('Error finding role:', error);
        throw error;
    }
};

export const findUserById = async (objectId:string)=>{
    try {
        const key = process.env.TOKEN_KEY || "kimandfamily";
        const user = await User.findById(objectId);
        if (!user) {
            throw new Error('User not found');
        }
        return user
    } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}

export const findTotalUsers = async (): Promise<number> => {
    try {
        const totalUsers = await User.countDocuments();
        return totalUsers;
    } catch (error) {
        console.error('Error finding total users:', error);
        throw error;
    }
};




// adctivity service
export const addActivityBasedOnWaitingList = async (
    activityData: {
      email: string;
      location: string;
      stationMarker: string;
      time: string;
      route: string;
      destinationMarker: string;
    },
    stationId: string
  ) => {
    try {
      // Find the station and check the waiting list
      const station = await Station.findById(stationId);
      if (!station) {
        return { status: "Error", message: "Station not found." };
      }
  
      const userInWaitingList = station.waiting?.some(
        (waitingUser) => waitingUser.email === activityData.email
      );
  
      if (userInWaitingList) {
        return {
          status: "Success",
          message: "User is already in the waiting list. No activity added.",
        };
      }
  
      // If the user is not in the waiting list, create the activity
      const newActivity = new Activity(activityData);
      await newActivity.save();
  
      return {
        status: "Success",
        message: "Activity added successfully.",
        data: newActivity,
      };
    } catch (error) {
      console.error("Error in addActivityBasedOnWaitingList service:", error);
      throw new Error("Error processing activity.");
    }
  };
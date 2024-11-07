import User from "../models/users.model";
import jwt from 'jsonwebtoken';
import RoleModel from '../models/roles.model'; // Adjust the path as per your file structure
import { interface_editUser, interface_User } from "../interface/user.interface";
import { Types } from "mongoose";

export const regis_user:{
    (payload:interface_User):Promise<{token:string,newUser:boolean,id:string}>
} = async (payload:interface_User)=>{
    try {
        const key = process.env.TOKEN_KEY || "kimandfamily";
        // find user in database
        const user = await User.findOne({ email: payload.email });
        // console.log("User found:", user);

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
          return {'token':token,'newUser':true,'id':`${newuser._id}`};
        }
    
        if (user.role === undefined || user.role === null ) {
            user.updateOne({role:payload.role});
        }

         token = jwt.sign({ id: user._id }, key);

         return {'token':token,'newUser':false,'id':`${user._id}`};;
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

export const findUserbyEmail = async (email:string)=>{
    try {
        const user = await User.findOne({email:email});
        if (!user) {
            return {"user":user,"message":"User not found","success":false};
        }
        return {"data":user,"message":"User found","success":true};
    }catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}

export const findAllUser = async (role:string)=>{
    try {
        const users = await User.find({role:role});
        if (!users) {
            throw new Error('User not found');
        }
        return users;
    }catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}

export const editUser:{(payload:interface_editUser):Promise<{message:string,success:boolean}>} = async (payload:interface_editUser)=>{
    try {
        let message = "";
        let success = false;
        if (!payload.id||payload.id==="") {
            throw new Error('ObjectId is required');
        }
        // console.log("Payload:", payload.id);
        const user = await User.findById(payload.id);
        const existingRole = await RoleModel.findOne({ Role: payload.role });  
        const checkemail = await User.find({email:payload.email});
        const SUPERADMIN = process.env.SUPERADMIN || "khumnoiw@gmail.com";
        if (!existingRole) {
            throw new Error('Role not found');
        } 
        if (!user) {
            throw new Error('User not found');
        }
        if (user.email === SUPERADMIN) {
            return {message:"Cannot edit admin",success:false};
            
        }
        if (checkemail.length > 0) {
            return {message:"Email already exists",success:false};
        }
        // edit all fields
        if (payload.name && payload.role && payload.email) {
            user.name = payload.name;
            user.email = payload.email;
            user.role = payload.role;
            await user.save();
            message = `User ${payload.email} updated successfully`;
            success = true;
        }
        // edit two fields 
        else if (payload.name && payload.email && !payload.role) {
            user.name = payload.name;
            user.email = payload.email;
            await user.save();
            message = `User ${payload.email} updated successfully`;
            success = true;
        } else if (payload.role && payload.email && !payload.name) {
            user.role = payload.role;
            user.email = payload.email;
            await user.save();
            message = `User ${payload.email} updated successfully`;
            success = true;
        } else if (payload.role && payload.name && !payload.email) {
            user.role = payload.role;
            user.name = payload.name;
            await user.save();
            message = `User ${payload.email} updated successfully`;
            success = true;
        }
        // edit one field
        else if (payload.email && !payload.name && !payload.role) {
            user.email = payload.email;
            await user.save();
            message = `User ${user.email} updated successfully`;
            success = true;
        } else if (payload.name && !payload.role && !payload.email) {
            user.name = payload.name;
            await user.save();
            message = `User ${payload.email} updated successfully`;
            success = true;
        } else if (payload.role && !payload.name && !payload.email) {
            user.role = payload.role;
            await user.save();
            message = `User ${payload.email} updated successfully`;
            success = true;
        } else {
            message = `No changes made to user ${payload.email}`;
            success = false;
        }
        return {message,success};
    } catch (error) {
        console.error(error);
        throw error;
    }
}
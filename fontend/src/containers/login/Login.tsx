import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { User } from "../../interfaces/user.interface";
const VITE_API = import.meta.env.VITE_API || "https://shutter.mfu.ac.th" 

export const sencodetobackend = async (access_token: string, redirect_uri?: string) => {
//   console.log("access_token : ", access_token);
  try {
    console.log("Sending request to backend with access_token");
    const response = await axios.post(
      `${VITE_API}/users/signin`,
      {
        access_token: access_token,
        redirect_uri: redirect_uri,
        flow_type: "implicit" // เพิ่ม flow type
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    );
    console.log("Backend response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to send access token to backend:", error);
    throw error; // เพิ่ม throw error เพื่อให้ frontend รู้ว่ามี error
  }
};

export const getUserinfo = async function (token?:string) {
    if (!token) {
        return {"role":null}
    }
    try {
        const response = await axios.get(
            `${VITE_API}/users/getUser`,
           {headers:{"x-auth-token":token}}
          );
        // Backend ส่ง JWT token กลับมา ไม่ใช่ข้อมูล user โดยตรง
        const user = jwtDecode<User>(response.data);
        console.log( new Date().getMilliseconds() ,user);
        if (!user) {
            return {"role":null}
        }
        return user;
    } catch (error) {
        console.error("Error in getUserinfo:", error);
        return {"role":null}
    }

}

export const sendGuest = async (name:string) => {
    try {
        const response = await axios.post(
            `${VITE_API}/users/createGuest`,
            {
              name: name,
            },
            {headers:{"Access-Control-Allow-Origin":"*"}}
        );
        return response.data;
    } catch (error) {
        console.error("Failed to send code to backend:", error);
    }
}
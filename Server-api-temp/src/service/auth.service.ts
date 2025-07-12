import axios from "axios";
import { jwtDecode } from "jwt-decode";
export interface Token{
  id:string,
  sub:string,
  iat:string
}

export async function getUserInfoFromToken(accessToken: string) {
  try {
    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
         timeout: 10000 
      }
    );
    console.log("[DEBUG] Google userinfo response:", userResponse.data);
    const userDetails = userResponse.data;
    console.log("User Details:", userDetails);
    return userDetails;
  } catch (err: any) {
    console.error("Error getting user info from token:", err);
    throw err;
  }
}

export async function auth(code: string, redirect_uri?: string) {
    const CLIENT_ID = process.env.CLIENT_ID;
    const SECRET_ID = process.env.SECRET_ID;
    const REDIRECTURL = redirect_uri || process.env.REDIRECTURL;
    try {
      console.log("[DEBUG] code:", code);
      console.log("[DEBUG] client_id:", CLIENT_ID);
      console.log("[DEBUG] redirect_uri:", REDIRECTURL);
      console.log("[DEBUG] client_secret length:", SECRET_ID?.length || 0);
      
      // ตรวจสอบว่ามี credentials ครบหรือไม่
      if (!CLIENT_ID || !SECRET_ID || !REDIRECTURL) {
        throw new Error("Missing OAuth credentials: " + JSON.stringify({
          hasClientId: !!CLIENT_ID,
          hasSecretId: !!SECRET_ID,
          hasRedirectUrl: !!REDIRECTURL
        }));
      }
      
      // แลก code เป็น access_token
      const response = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: CLIENT_ID,
        client_secret: SECRET_ID,
        redirect_uri: REDIRECTURL,
        grant_type: "authorization_code",
      },
      { timeout: 10000 });
      console.log("[DEBUG] Google token response:", response.data);
      const accessToken = response.data.access_token;
      console.log("Access Token:", accessToken);
      // Fetch user details using the access token
      const userResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
           timeout: 10000 
        }
      );
      console.log("[DEBUG] Google userinfo response:", userResponse.data);
      const userDetails = userResponse.data;
      console.log("User Details:", userDetails);
      return userDetails;
    } catch (err: any) {
      if (err.response) {
        console.error("Error exchanging code for token:", err.response.data);
        console.error("[DEBUG] Error config:", err.config);
      } else {
        console.error("Error exchanging code for token:", err);
      }
      throw err;
    }
}

export  function parseJwt(token: string) {
  console.log("Token : ", token);
  var jsonPayload =  jwtDecode<Token>(token);
  return jsonPayload;
}
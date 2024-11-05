import { Feedback } from "../../interfaces/feedback.interface";
import axios, { AxiosResponse } from "axios";
const API_URL = import.meta.env.VITE_API
import Cookies from "js-cookie"; // Import the 'Cookies' module

export const getFeedback = async (setFeedbacks:React.Dispatch<React.SetStateAction<AxiosResponse<Feedback[], null> | null>>) => {

  try {
     let token =  Cookies.get("token") || "";

        if (!token||token==="") {
            throw new Error('Error! No token found');
        }
        const response = await axios.get(`${API_URL}/getFeedback`,
            {headers:{"x-auth-token":token}});
        if (response.status !== 200) {
          throw new Error('Error! Fetching stations');
        }
        if (response.data.length === 0) {
          throw new Error('Error! No stations found');
        }
        setFeedbacks(response);
      } catch (error) {
        console.error(error);
      }
}

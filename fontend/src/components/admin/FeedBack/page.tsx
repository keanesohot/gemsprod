import React, { useState,useEffect } from "react";
import { getFeedback } from '../../../containers/getfeedBack/getFeedback';
import { Feedback } from "../../../interfaces/feedback.interface";
import { AxiosResponse } from "axios";

const FeedBack: React.FC<{}> = () => {
    const [feedbacks, setFeedbacks] = useState<AxiosResponse<Feedback[], null> | null>(null);
    useEffect(() => {
        getFeedback(setFeedbacks);
    },[])
    const refreshFeedbacks = () => {
        getFeedback(setFeedbacks);
    };
    return (
        <div className=" w-full flex flex-col items-center justify-center p-2 px-4 min-h-screen overflow-x-auto">
            {/* {loading && <h1>Loading...</h1>} */}


            <div className="  rounded-xl px-5 absolute content-center top-10 right-10 w-fit h-10 bg-yellow-300">
                <div className="flex   ">
                    <h1 className="text-white font-bold pr-2">All FeedBack</h1>
                    <h1 className="text-red-500 font-bold"> {feedbacks ? feedbacks?.data.length : ""}</h1>
                </div>

            </div>
            <div className="overflow-y-scroll bg-white h-fit w-full p-2 m-4 rounded-3xl">
            <button className="fix ml-3 mt-2 material-icons " onClick={refreshFeedbacks} >
              {feedbacks ? "refresh" : ""}
            </button>
            {feedbacks && feedbacks.data.map((feedback: Feedback,index:number) => {
                return( <div key={index} className=" w-full p-2 rounded-xl bg-white m-5 border-1 shadow-md ">
                    <div className="flex">
                        <h1 className="pr-2">Date : </h1>
                        <h1>{new Date(feedback.createdAt).toUTCString()}</h1>
                    </div>
                    <div className="flex">
                        <h1 className="pr-2">Description: </h1>
                        <h1 className="break-words">{feedback.description}</h1>
                    </div>
                </div>)
            })}
            </div>
        </div>
    )
}
export default FeedBack;
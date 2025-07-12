import logo from "/Screenshot_2567-07-10_at_12.04.25-removebg.png";
import mfulogo from "/Mae-Fah-Luang-University-2-768x779.png";
import googlelogo from "/googlelogo.png";
import "./style.sass";
import { getUserinfo, sencodetobackend } from "../../containers/login/Login";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";
import Loading from '../loading/loading';
import Cookies from 'js-cookie';
// import {
//   Icon
// } from "@mui/material";
// import Swal from "sweetalert2";
const Login:React.FC<{}> = () => {
  // const [, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const login = async (tokenResponse: { access_token: string }) => {
    setLoading(true);
    try {
      // สำหรับ implicit flow, tokenResponse จะมี access_token
      const token = await sencodetobackend(tokenResponse.access_token, "https://shutter.mfu.ac.th");
      console.log("Token received from backend:", token);
      // setCookie("token", token);
      Cookies.set("token", token);
      console.log("Token set in cookies:", Cookies.get("token"));
      console.log("All cookies:", document.cookie);
      // get role from user info
      const userInfo = await getUserinfo(token);

      if (userInfo.role === null) {
        console.error("Database error - userInfo.role is null");
        setLoading(false);
        return;
      }
      
      console.log("Role : ", userInfo.role);
      setLoading(false);
      switch (userInfo.role) {
        case "USER":
          navigate("/map", { replace: true });
          break;
        case "ADMIN":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "STAFF":
          navigate("/staff/dashboard", { replace: true })
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error in login function:", error);
      setLoading(false);
    }
  };

  const auth = useGoogleLogin({
    onSuccess: (tokenResponse: { access_token: string }) => login(tokenResponse),
    onError: () => {
      console.log("Login Failed");
    },
    flow: "implicit"
  });

  const handleGoogleLogin = () => {
    auth();
  };

  // const login_guest = async () => {
  //   await Swal.fire({
  //     title: "Guest Login",
  //     input: "text",
  //     inputLabel: "Enter your name",
  //     showCancelButton: true,
  //     confirmButtonText: "Login",
  //     cancelButtonText: "Cancel",
  //     cancelButtonColor: "#e2b644",
  //     confirmButtonColor: "#8b090c",
  //     background: "#f9f4d4",
  //     reverseButtons: true,
  //     showClass: {
  //       popup: `
  //         animate__animated
  //         animate__fadeInUp
  //         animate__faster
  //       `,
  //     },
  //     hideClass: {
  //       popup: `
  //         animate__animated
  //         animate__fadeOutDown
  //         animate__faster
  //       `,
  //     },
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       const name = result.value;
  //       const token = await sendGuest(name);
  //       // setCookie("token", token);
  //       Cookies.set("token", token);
  //       navigate("/map", { replace: true });
  //     }
  //   })
    
  // }

  return (
    <>
        {/* loading */}
      {loading && <Loading />}
      <div className=" grid md:grid-cols-3 grid-rows-3  w-screen h-screen ">
        <div className="flex ml-5 mt-5 items-center h-14">
          <img src={mfulogo} alt="mfulogo" className="w-14 h-14" />
          <h1 className="texthighlightcolor">MFU</h1>
        </div>
        <div className="md:col-start-2 row-start-2  md:justify-self-center self-center">
          <h1 className=" text-center mb-4 textcolor text-3xl font-bold ">
            GEMS
          </h1>
          <img
            src={logo}
            alt="mfu-logo"
            className=" lg:w-96 md:w-80 w-64 mb-5 mx-auto"
          />
          <div
            className="flex justify-center googlebutton h-14 items-center rounded-full"
            onClick={handleGoogleLogin}
          >
            <img src={googlelogo} alt="googlelogo" width={20} />
            <p className=" text-white ml-2"> Sign in</p>
          </div>
          {/* <div
            className="flex justify-center h-14 items-center bg-gray-500 text-white rounded-full"
            onClick={login_guest}
          >
          <Icon>person</Icon> 
          <h3 className=" select-none">Login with guest</h3> 
          </div> */}
          {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
        </div>
      </div>
    </>
  );
};
export default Login;

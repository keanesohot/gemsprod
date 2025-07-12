import React, { useEffect, useState } from 'react';
import {  Navigate } from 'react-router-dom';
import Loading from '../loading/loading';
import { getUserinfo } from '../../containers/login/Login';
import Cookies from 'js-cookie';
interface ProtectRouteProps {
  children: React.ReactNode;
  requireRoles?: string[];

}

const ProtectloginRoute: React.FC<ProtectRouteProps> = ({ children = []}) => {
  const [isAuthen, setIsAuthen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<{ email: string; name: string; role: string } | null>(null);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      let finished = false;
      try {
        if (Cookies.get("token") && Cookies.get("token") !== undefined && Cookies.get("token") !== 'undefined') {
          const userInfo = await getUserinfo(Cookies.get("token"));
          // เช็คจาก role เลย
          if (userInfo?.role && userInfo.role !== null && userInfo.role !== 'undefined') {
            setIsAuthen(true);
            setUserRole(userInfo);
          } else {
            setIsAuthen(false);
          }
        } else {
          setIsAuthen(false);
        }
      } catch (error) {
        setIsAuthen(false);
      } finally {
        if (!finished) {
          setIsLoading(false);
          // log for debug
          console.log('setIsLoading(false) called in protectlogin');
          finished = true;
        }
      }
    };
    fetchUserRole();
  }, []);

  if (isLoading) {
    return <Loading/>; // Or any other loading indicator
  }

  if (isAuthen && userRole) {
    if (userRole.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    }else if (userRole.role === 'STAFF'){
      return <Navigate to="/staff/dashboard"/>
    }
    return <Navigate to="/map" replace />;
  }else{
    Cookies.remove("token");
  }

  return <>{children}</>;
};

export default ProtectloginRoute;

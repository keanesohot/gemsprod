import React, { useEffect, useState } from 'react';
import {  Navigate} from 'react-router-dom';
import { getUserinfo } from '../../containers/login/Login';
import Loading from '../loading/loading';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';


interface ProtectRouteProps {
  children: React.ReactNode;
  requireRoles?: string[];

}

const ProtectmapRoute: React.FC<ProtectRouteProps> =  ({ children, requireRoles = []}) => {
  const [userRole, setUserRole] = useState<{ email: string; name: string; role: string } | null>(null);
  const [isAuthen, setIsAuthen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenCheck, setTokenCheck] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserRole = async () => {
      let finished = false;
      try {
        const token = Cookies.get("token");
        
        if (token && token !== undefined && token !== 'undefined') {
          const userInfo = await getUserinfo(token);
  
          
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
                      finished = true;
        }
      }
    };
    fetchUserRole();
  }, [tokenCheck]); // ใช้ tokenCheck เป็น dependency

  // เพิ่ม effect เพื่อ trigger re-authentication เมื่อ token เปลี่ยน
  useEffect(() => {
    const interval = setInterval(() => {
      const token = Cookies.get("token");
      if (token && !isAuthen) {
        setTokenCheck(prev => prev + 1);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isAuthen]);

  if (isLoading) {
    return <Loading/>; // Or any other loading indicator
  }
  console.log(`isAuthen : ${isAuthen}`);
  if (!isAuthen) {
    Cookies.remove("token");
    return <Navigate to="/" replace />;
  }
  console.log(`userRole : ${userRole}`);
  if (!userRole || !userRole.role) {
    Cookies.remove("token");
    return <Navigate to="/" replace />;
  }

  const matchRoles = !requireRoles.length || requireRoles.includes(userRole.role);
  console.log(matchRoles);
  if (!matchRoles) {
     Swal.fire({
      title: t('navbar.permissionDenied.title'),
      text: t('navbar.permissionDenied.text'),
      icon: 'error',
      allowOutsideClick: false,
      confirmButtonText: t('navbar.permissionDenied.confirm'),
    }).then(()=>{
        Cookies.remove("token");
        return <Navigate to="/" replace />;
    });
  }
  

  return <>{children}</>;
};



export default ProtectmapRoute;

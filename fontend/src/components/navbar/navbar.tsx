import gemlogo from "/Screenshot_2567-07-10_at_12.04.25-removebg.png";
import "./style.sass";
import { useState } from "react";
import 'animate.css';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import settingIcon from '/Settingicon.png';
import languageIcon from '/languageicon.png';

// export const [activeContent, setActiveContent] = useState(null);

const Navbar: React.FC<{
  activeContent: any;
  setActiveContent: React.Dispatch<React.SetStateAction<string | null>>;
  setinfoIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setsettingIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setsettingIsVisible,activeContent, setActiveContent, setinfoIsVisible }) => {
  const [isAnimating, setIsAnimating] = useState(true);


  const handleLogoClick = () => {
    setIsAnimating((prevState) => !prevState);
    window.location.reload();
  };

  const handleContentClick = (contentId: any) => {
    setActiveContent((prevContentId) =>
      prevContentId === contentId ? prevContentId : contentId
    );
  };

  const {t} = useTranslation();

  

  const toggleVisibility = () => {
    setinfoIsVisible((prev) => !prev);
  };

  const toggleVisibilitySetting = () => {
    setsettingIsVisible((prev) => !prev);
  };
  

  return (
    <nav
      className={`navbar fixed bottom-4 left-1 right-1 z-50 ${
        isAnimating ? "" : "navbar-close"
      }`}
    >
      <div className="px-10 flex items-center h-16 navbar-wrapper ">
        <div
          className={`content ${
            activeContent === "content1" ? "selected" : ""
          }`}
          onClick={() => toggleVisibilitySetting()}
        >
          <img src={settingIcon} alt="setting" style={{ width: 32, height: 32 }} />
        </div>
        <div
          className={`content ${
            activeContent === "content2" ? "selected" : ""
          }`}
          onClick={() => toggleVisibility()}
        >
          <img src={languageIcon} alt="language" style={{ width: 32, height: 32 }} />
        </div>
  
        <img
          src={gemlogo}
          alt="logo"
          className={` logo w-20 ${isAnimating ? "spin" : ""}`}
          onClick={handleLogoClick}
        />
        <div
          className={`content route-btn  ${
            activeContent === "route1" ? "selected" : ""
          }`}
          onClick={() => handleContentClick("route1")}
        >
         {t('navbar.route.route1')}
        </div>
        <div
          className={`content route-btn  ${activeContent === "route2" ? "selected" : ""} `}
          onClick={() => handleContentClick("route2")}
        >
          {t('navbar.route.route2')}
        </div>
      </div>

 

    </nav>

    

  );
};

export default Navbar;

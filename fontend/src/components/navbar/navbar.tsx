import gemlogo from "/Screenshot_2567-07-10_at_12.04.25-removebg.png";
import "./style.sass";
import { useState } from "react";
import 'animate.css';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import settingIcon from "/Settingicon.png";

// export const [activeContent, setActiveContent] = useState(null);

const Navbar: React.FC<{
  activeContent: any;
  setActiveContent: React.Dispatch<React.SetStateAction<string | null>>;
  setinfoIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setsettingIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setsettingIsVisible,activeContent, setActiveContent, setinfoIsVisible }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [isOpen, setIsOpen] = useState(true);


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
    <>
      {/* Toggle Bar */}
      <div
        style={{
          width: '100vw',
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: isOpen ? 56 : 0, // 56px = navbar height
          zIndex: 101,
          background: 'var(--primaryColorLighter)',
          color: 'white',
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'bottom 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Hide navbar' : 'Show navbar'}
      >
        <span
          className="material-icons"
          style={{
            fontSize: 28,
            transition: 'transform 0.3s',
            color: 'black',
            fontWeight: 700,
            textShadow: '0 1px 2px rgba(0,0,0,0.18)',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '0.5px',
          }}
        >
          {isOpen ? 'expand_more' : 'expand_less'}
        </span>
      </div>
      <nav
        className={`navbar fixed bottom-0 left-0 right-0 z-50 ${isOpen ? '' : 'navbar-closed'}`}
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="px-10 flex items-center h-14 navbar-wrapper ">
          <div
            className={`content ${
              activeContent === "content1" ? "selected" : ""
            }`}
            onClick={() => toggleVisibilitySetting()}
          >
            <div style={{
              background: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'none'
            }}>
              <img src={settingIcon} alt="setting" style={{ width: 24, height: 24, filter: 'brightness(0) saturate(100%)', background: 'none' }} />
            </div>
          </div>
          <div
            className={`content ${
              activeContent === "content2" ? "selected" : ""
            }`}
            onClick={() => toggleVisibility()}
          >
            <div style={{
              background: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'none'
            }}>
              <span className="material-icons" style={{ color: 'black', fontSize: 32, background: 'none' }}>place</span>
            </div>
          </div>
    
          <img
            src={gemlogo}
            alt="logo"
            className={` logo w-20 ${isAnimating ? "spin" : ""}`}
            onClick={handleLogoClick}
          />
          <div
            className={`content  ${
              activeContent === "route1" ? "selected" : ""
            } `}
            onClick={() => handleContentClick("route1")}
          >
           {t('navbar.route.route1')}
          </div>
          <div
            className={`content  ${activeContent === "route2" ? "selected" : ""} `}
            onClick={() => handleContentClick("route2")}
          >
            {t('navbar.route.route2')}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

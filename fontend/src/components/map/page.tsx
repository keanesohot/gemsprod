import React, { useEffect, useState } from "react";
import MapComponent from "./mapComponent";
import InfoDialog from "../infoDialog/infoDialog";
import { fetchStations } from "../../containers/station/getStation";
import { AxiosResponse } from "axios";
import { Polylines } from "../../interfaces/polylines.interface";
import { fetchPolylines } from "../../containers/polyline/getPolyline";
import Loading from "../loading/loading";
import { SelectedMarker } from "./stationmarker";
import { Stations } from "../../interfaces/station.interface";
import FeedbackDialog from "../feedbackDialog/feedBackDialog";
import Cookies from "js-cookie";
import FloatingButtonGroup from "./FloatingButtonGroup";
import FloatingRouteSwitcher from "./FloatingRouteSwitcher";
import CookieModal from "../cookieModal/cookieModal";
// import LanguageSwitcher from "../buttonLanguage/LanguageSwitcher";
import SettingModal from "../settingModal/settingModal";
import { useNavigate } from "react-router-dom";
import { getUserinfo } from "../../containers/login/Login";
import useUserLocation from "../../containers/userLocation/getUserLocation";
import { useTranslation } from 'react-i18next';

const Mappage: React.FC<{}> = ({}) => {
  const [selectRoute, setSelectRoute] = useState<string | null>("route1");
  const [isVisible, setIsVisible] = useState(false);
  const [issettingIsVisible, setsettingIsVisible] = useState(false);
  const [stations, setStations] = useState<AxiosResponse<Stations[]> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  // set center
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>({
    lat: 20.045116568504863,
    lng: 99.89429994369891,
  });
  const [shouldResetCenter, setShouldResetCenter] = useState(false);
  // fetch polylines ==================================================================================================
  const [polylines, setPolylines] = useState<AxiosResponse<Polylines[]> | null>(
    null
  );
  const [selectedstationMarker, setselectedstationMarker] =
    useState<SelectedMarker | null>(null);

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const info = await getUserinfo(Cookies.get("token"));
      setUserInfo(info);
    };
    fetchUserInfo();
  }, []);

  // เปลี่ยน useState เป็น useEffect สำหรับ data fetching
  useEffect(() => {
    fetchStations(setStations, setLoading);
    fetchPolylines(setPolylines, setLoading);
    // ไม่จำเป็นต้อง log stations/polylines ที่นี่
 }, []);
// console.log(loading);

  // Feedback Dialog =================================================================================================
  const [showFeedback, setShowFeedback] = useState(false);
  const handleCloseFeedback = () => {
    setShowFeedback(false);
  };

  // Cookie Modal =================================================================================================
  const [showCookieModal, setShowCookieModal] = useState(false);
  useEffect(() => {
    const hasAcceptedCookies = Cookies.get("cookieConsent") === "true";
    if (!hasAcceptedCookies) {
      setShowCookieModal(true);
    }
  }, []);

  // ฟังก์ชัน mock สำหรับปุ่มต่าง ๆ
  const handleLogout = async () => {
    Cookies.remove("token");
    navigate("/", { replace: true });
  };
  const handleDestination = () => {
    setIsVisible(true);
  };

  // ดึงปลายทางจริงจากข้อมูลสถานี

  const [showLineInfo, setShowLineInfo] = useState(false);
  const location = useUserLocation();
  const { t } = useTranslation();

  return (
    <>
      <FloatingButtonGroup
        onLogout={handleLogout}
        onDestination={handleDestination}
        userInfo={userInfo}
        onFeedback={() => setShowFeedback(true)}
      />
      <div style={{ position: 'fixed', top: 16, left: 16, zIndex: 201, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <FloatingRouteSwitcher
          selectedRoute={selectRoute}
          setSelectedRoute={setSelectRoute}
        />
        <button
          onClick={() => setShowLineInfo(v => !v)}
          style={{ background: 'transparent', border: 'none', borderRadius: '50%', width: 44, height: 44, boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          title="Line Info"
          aria-label="Line Info"
        >
          <span className="material-icons" style={{ fontSize: 36, color: '#222' }}>info</span>
        </button>
      </div>
      <CookieModal
        showCookieModal={showCookieModal}
        setShowCookieModal={setShowCookieModal}
 />
      <FeedbackDialog isVisible={showFeedback} onClose={handleCloseFeedback} />

      {loading && <Loading />}

      <InfoDialog
        isVisible={isVisible}
        setinfoIsVisible={setIsVisible}
        stations={stations}
        selectedMarker={selectedstationMarker}
        setSelectedMarker={setselectedstationMarker}
        setCenter={setCenter}
        setShouldResetCenter={setShouldResetCenter}
        shouldResetCenter={shouldResetCenter}
        center={center}
        selectedRoute={selectRoute}
      />

      <SettingModal setActiveContent={setSelectRoute} setsettingIsVisible={setsettingIsVisible} settingisVisible={issettingIsVisible}/>

      {/* Info Dialog for Line Destinations (show only for selected line) */}
      {showLineInfo && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setShowLineInfo(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.15)',
              zIndex: 299,
            }}
          />
          {/* Popup */}
          <div style={{ position: 'fixed', top: 90, left: 16, zIndex: 300, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.13)', padding: '1.5rem 1.2rem 1.2rem 1.2rem', minWidth: 220, maxWidth: 260, maxHeight: 400, overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 18 }}>{selectRoute === 'route1' ? t('navbar.lineInfo.title') + ' 1' : t('navbar.lineInfo.title') + ' 2'}</div>
              <button onClick={() => setShowLineInfo(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', width: 48, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b090c', fontWeight: 700 }} aria-label="close">
                <span style={{fontSize: 22, fontWeight: 700}}>&times;</span>
              </button>
            </div>
            <ul style={{ padding: 0, margin: 0 }}>
              {(t(selectRoute === 'route1' ? 'navbar.lineInfo.route1' : 'navbar.lineInfo.route2', { returnObjects: true }) as string[]).map((stop, idx) => (
                <li key={idx} style={{ fontSize: 15 }}>{stop}</li>
              ))}
            </ul>
            <button
              onClick={() => setShowLineInfo(false)}
              style={{
                marginTop: 18,
                width: '100%',
                padding: '10px 0',
                background: '#e2b644',
                color: '#222',
                border: 'none',
                borderRadius: 8,
                fontSize: 17,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)'
              }}
            >
              {t('navbar.closeButton')}
            </button>
          </div>
        </>
      )}


      <MapComponent
        selectedRoute={selectRoute}
        setStations={setStations}
        stations={stations}
        selectedstationMarker={selectedstationMarker}
        setselectedstationMarker={setselectedstationMarker}
        polylines={polylines}
        center={center}
        setCenter={setCenter}
        setShouldResetCenter={setShouldResetCenter}
        shouldResetCenter={shouldResetCenter}
        setLoading={setLoading}
        userInfo={userInfo}
      />
      {/* ปุ่ม user position มุมขวาล่าง */}
      <button
        onClick={() => {
          if (location && location.lat && location.lng) {
            setCenter({ lat: location.lat, lng: location.lng });
            setShouldResetCenter(true);
          }
        }}
       style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 210,
          background: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 56,
          height: 56,
          boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: location && location.lat && location.lng ? 'pointer' : 'not-allowed',
          opacity: location && location.lat && location.lng ? 1 : 0.5,
        }}
        title="ไปตำแหน่งของฉัน"
        disabled={!(location && location.lat && location.lng)}
      >
        <span className="material-icons" style={{ fontSize: 32, color: 'red' }}>my_location</span>
      </button>
    </>
  );
};

export default Mappage;

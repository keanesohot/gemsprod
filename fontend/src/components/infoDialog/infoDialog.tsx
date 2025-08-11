import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useClosestBus from "../../containers/calulateDistance/calculateDistance";
import useUserLocation from "../../containers/userLocation/getUserLocation";
import { useWebSocketData } from "../../containers/getGemsDataWebsocket/getGemsWebsocket";
import gemlogo from "/Screenshot_2567-07-10_at_12.04.25-removebg.png";
import { AxiosResponse } from "axios";
import useNearestStation from "../../containers/calulateDistance/calculateuserAndbustop";
import { SelectedMarker } from "../map/stationmarker";
import { Stations } from "../../interfaces/station.interface";
import StationToStationComponent from "../../containers/calulateDistance/calStationToStation";
import { BusInfo } from "../../interfaces/bus.interface";
import { useTranslation } from "react-i18next";

interface WebSocketMessage {
  status: string;
  data: {
    [key: string]: BusInfo;
  };
}

const InfoDialog: React.FC<{
  isVisible: boolean;
  setinfoIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  stations: AxiosResponse<Stations[], any> | null;
  selectedMarker: SelectedMarker | null;
  setSelectedMarker: React.Dispatch<
    React.SetStateAction<SelectedMarker | null>
  >;
  setCenter: React.Dispatch<
    React.SetStateAction<{
      lat: number;
      lng: number;
    } | null>
  >;
  center: {
    lat: number;
    lng: number;
  } | null;
  shouldResetCenter: boolean;
  setShouldResetCenter: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRoute: string | null;
}> = ({
  isVisible,
  setinfoIsVisible,
  stations,
  selectedMarker,
  setSelectedMarker,
  setCenter,
  center,
  setShouldResetCenter,
  shouldResetCenter,
  selectedRoute,
}) => {
  const toggleVisibility = () => {
    setinfoIsVisible((prev) => !prev);
  };

  const [isSearch, setIssearching] = useState<boolean>(false);

  const toggleSearch = () => {
    setIssearching((prev) => !prev);
  };

  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Close the search overlay if a click is detected outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        setIssearching(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let stationMarkers: Stations[] = [];

  // ตำแหน่งของผู้ใช้งาน  ================================================
  const location = useUserLocation();

  // รับข้อมูลจาก websocket  ================================================
  const { messages } = useWebSocketData() as {
    messages: WebSocketMessage | null;
  };
  const data = useMemo(() => {
    return messages && messages.status === "ok" ? messages.data : null;
  }, [messages]);

  // ClostestStation =========================================================
  // station markers mock ==================================================================================================

  if (stations?.data !== undefined) {
    stationMarkers = stations?.data;
    0;
  }

  //ป้ายที่ใกล้กับเราที่สุด
  const closestStation = useNearestStation(
    stationMarkers,
    location,
    selectedRoute,
    selectedMarker
  );

  //นำป้ายใกล้กับเรามาหา รถบัสที่ใกล้ที่สุด
  const closestBusData = useClosestBus(closestStation, data);

  // ระยะห่างระหว่างป้ายที่เราเลือกกับป้ายที่ใกล้เราที่สุด
  const [stationToStation, setStationToStation] = useState(0);

  const calETA = useCallback((distance: number) => {
    const speedMeterPerSecond = (30 * 1000) / 3600;
    const timeInSeconds = distance / speedMeterPerSecond;
    const timeInMinutes = timeInSeconds / 60;
    const roundedMinutes = Math.round(timeInMinutes * 2) / 2;
    const minutes = Math.floor(roundedMinutes);
    const seconds = Math.round((roundedMinutes % 1) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const eta = useMemo(() => {
    return stationToStation > 0 ? calETA(stationToStation) : "?";
  }, [stationToStation, calETA]);

  useEffect(() => {
    if (selectedMarker) {
      const result = StationToStationComponent({
        selectedMarker,
        closestStation,
      });
      if (typeof result === "number") {
        setStationToStation(result);
        // Distance calculated
      }
    }
  }, [selectedMarker, closestStation]);

  // Search functionality =========================================
  const [searchQuery, setSearchQuery] = useState("");
  const filteredStations = useMemo(() => {
    return stationMarkers.filter((station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, stationMarkers]);

  const handleStationClick = (station: Stations) => {
    setSelectedMarker({
      key: station.id,
      value: {
        _id: `${station.id}`,
        position: station.position,
      },
    });
    // Close the dialog
    setIssearching(false);
    const [lat, lng] = station.position.split(",").map(Number);
    setCenter({
      lat: lat,
      lng: lng,
    });
    setShouldResetCenter(true);
  };
  useEffect(() => {
    if (shouldResetCenter && center) {
      // This will run after the component has re-rendered with the new center
      const timer = setTimeout(() => {
        setCenter(null);
        setShouldResetCenter(false);
      }, 0);

      // Cleanup the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [center, shouldResetCenter]);

  const { t } = useTranslation();
  // ดึง array ชื่อจุดจอดจาก i18n ตาม selectedRoute
  const stopsRoute1 = t('navbar.lineInfo.route1', { returnObjects: true }) as string[];
  const stopsRoute2 = t('navbar.lineInfo.route2', { returnObjects: true }) as string[];

  return (
    <>
      {/* Dialog */}
      <div
        className={`fixed bottom-24 left-0 right-0 z-50 flex justify-center transition-all duration-300 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
        }`}
      >
          <div
            className="bg-white rounded-2xl shadow-2xl py-6 px-6 sm:px-10 max-w-md w-full relative flex flex-col gap-4"
            style={{ minWidth: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src={gemlogo} alt="logo" className="w-10 h-10 rounded-full bg-gray-100" />
                <div className="font-bold text-lg text-[#8b090c]">GEM {closestBusData.busId}</div>
              </div>
              <button
                className="text-gray-400 hover:text-[#8b090c] transition-colors duration-150 text-2xl font-bold p-1 rounded-full focus:outline-none"
                onClick={toggleVisibility}
                aria-label="ปิด"
              >
                ×
              </button>
            </div>
            {/* ETA/Arrival */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-icons text-[#e2b644] text-2xl">schedule</span>
                <span className="text-gray-700 font-medium">
                  {closestBusData.eta && closestBusData.eta > 0
                    ? t("navbar.infodialog.busArrival", { minutes: closestBusData.eta.toFixed(2) })
                    : t("navbar.infodialog.busArrivalError")}
                </span>
              </div>
            </div>
            {/* Closest Station */}
            <div className="flex items-center gap-2 bg-[#e2b644]/80 rounded-lg px-3 py-2 shadow">
              <span className="material-icons text-[#8b090c] text-xl">place</span>
              <span className="text-black font-semibold">
                {closestStation
                  ? t("navbar.infodialog.closestStation", {
                      stationName: closestStation.stationNameId,
                      distance: closestStation.distance.toFixed(0),
                    })
                  : t("navbar.infodialog.findingLocation")}
              </span>
            </div>
            {/* Distance & ETA to selected marker */}
            {selectedMarker && (
              <div className="flex flex-col gap-1 bg-[#f9f4d4] rounded-lg px-3 py-2 shadow">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-[#1976d2] text-xl">directions_bus</span>
                  <span className="text-black">
                    {t("navbar.infodialog.distanceInfo", { distance: stationToStation.toFixed(0) })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-icons text-[#1976d2] text-xl">timer</span>
                  <span>
                    {t("navbar.infodialog.etaInfo", { eta })}
                  </span>
                </div>
              </div>
            )}
            {/* Search/Select Station Button */}
            <button
              className="w-full mt-2 py-3 rounded-lg bg-[#8b090c] hover:bg-[#a91c1c] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-colors duration-150"
              onClick={toggleSearch}
            >
              <span className="material-icons text-white text-xl">search</span>
              {selectedMarker
                ? t("navbar.infodialog.markerInfo", { markerKey: selectedMarker.key })
                : t("navbar.infodialog.selectMarker")}
            </button>
            {/* Search Overlay */}
            {isSearch && (
              <div
                className={`fixed inset-0 h-12 z-70 flex items-center justify-center search-overlay ${
                  isSearch ? "active" : ""
                }`}
              >
                <div
                  ref={overlayRef}
                  className={`bg-white rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto search-container ${
                    isSearch ? "active" : ""
                  }`}
                >
                  <input
                    type="text"
                    placeholder={t("navbar.infodialog.searchPlaceholder")} // Use translation for placeholder
                    className="w-full h-10 mb-4 shadow-lg border border-gray-300 rounded-lg pl-3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="stationList">
                    {filteredStations.map((station) => {
                      const idx = Number(station.id) - 1;
                      let displayName = station.name;
                      if (!isNaN(idx) && idx >= 0) {
                        if (selectedRoute === 'route1' && stopsRoute1[idx]) displayName = stopsRoute1[idx];
                        else if (selectedRoute === 'route2' && stopsRoute2[idx]) displayName = stopsRoute2[idx];
                        else if (stopsRoute1[idx]) displayName = stopsRoute1[idx];
                        else if (stopsRoute2[idx]) displayName = stopsRoute2[idx];
                      }
                      return (
                        <div
                          key={station._id}
                          className="stationItem flex items-center justify-between pl-3 py-1 border-b border-gray-200 cursor-pointer"
                          onClick={() => handleStationClick(station)}
                        >
                          <span className="text-black">{displayName}</span>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg"
                    onClick={toggleSearch}
                  >
                    {t("navbar.infodialog.closeSearch")}
                  </button>
                </div>
              </div>
            )}
          </div>
      </div>
    </>
  );
};

export default InfoDialog;

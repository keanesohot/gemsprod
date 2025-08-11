import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  useMap,
  // ,
  // AdvancedMarker
} from "@vis.gl/react-google-maps";
import { useWebSocketData } from "../../containers/getGemsDataWebsocket/getGemsWebsocket";
import { useCallback, useMemo, useState, useEffect } from "react";
import React from "react";
import useUserLocation from "../../containers/userLocation/getUserLocation";
import StationMarker, { SelectedMarker } from "./stationmarker";
import { AxiosResponse } from "axios";
import { Polylines } from "../../interfaces/polylines.interface";
import { Stations } from "../../interfaces/station.interface";
import { BusData, BusInfo } from "../../interfaces/bus.interface";
import { useTranslation } from "react-i18next";
import userIcon from '/userIcon.png';
const MAPID = import.meta.env.VITE_MAPID || "";
const MAPAPIKEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const busIcon = (direction: number) => {
  return {
    url: "/Bus.svg", // ยังใช้ไอคอนเดิมสำหรับรถเจ็ม
    scaledSize: window.google.maps.Size
      ? new window.google.maps.Size(120, 76)
      : null,
    origin: window.google.maps.Point
      ? new window.google.maps.Point(0, 0)
      : null,
    anchor: window.google.maps.Point
      ? new window.google.maps.Point(60, 38)
      : null,
    rotation: direction,
  };
};
// const busIcon = (direction:number) => {
//   return {
//     path: "M10 20 L15 0 L20 20 L10 20 Z", // Example path, replace with your icon's path
//     fillColor: "red",
//     fillOpacity: 1,
//     scale: 1,
//     strokeColor: "red",
//     strokeWeight: 1,
//     rotation: direction,
//     // anchor: new window.google.maps.Point(15, 30) // Adjust anchor point as needed
//   };
// };

// API Key loaded
interface TrackerData {
  _id: string;
  server_time: string;
  tracker_time: string;
  direction: number;
  position: string;
  speed: number;
}

export interface WebSocketMessage {
  status: string;
  data: {
    [key: string]: BusInfo;
  };
}

const MapComponant: React.FC<{
  stations: AxiosResponse<Stations[], any> | null;
  setStations: React.Dispatch<
    React.SetStateAction<AxiosResponse<Stations[], any> | null>
  >;
  selectedRoute?: string | null;
  polylines: AxiosResponse<Polylines[], any> | null;
  selectedstationMarker: SelectedMarker | null;
  setselectedstationMarker: React.Dispatch<
    React.SetStateAction<SelectedMarker | null>
  >;
  setShouldResetCenter: React.Dispatch<React.SetStateAction<boolean>>;
  shouldResetCenter: boolean;
  setCenter: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
  center: {
    lat: number;
    lng: number;
  } | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userInfo?: { picture?: string } | null;
}> = ({
  setLoading,
  polylines,
  selectedRoute,
  stations,
  selectedstationMarker,
  setselectedstationMarker,
  setStations,
  center,
  setCenter,
  setShouldResetCenter,
  shouldResetCenter,
  userInfo,
}) => {
  ///////////// test polyline component ///////////////////////
  const PolylineComponent: React.FC<{
    path: google.maps.LatLngLiteral[];
    color: string;
  }> = ({ path, color }) => {
    const map = useMap();

    useEffect(() => {
      if (map && window.google) {
        const polyline = new window.google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: color,
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });

        polyline.setMap(map);

        return () => {
          polyline.setMap(null);
        };
      }
    }, [map, path, color]);

    return null;
  };
  //////////////////////////////////////////////////////////////

const {t} = useTranslation();  
  // ดึง array ชื่อสถานีจาก i18n
  const stopsRoute1 = t('navbar.lineInfo.route1', { returnObjects: true }) as string[];
  const stopsRoute2 = t('navbar.lineInfo.route2', { returnObjects: true }) as string[];
  function getStationName(stationString: string) {
    // สมมติ stationString = "สถานีที่ 15 - จุดศูนย์จีน ขาออก"
    const match = stationString && stationString.match(/สถานีที่\s*(\d+)/);
    if (match) {
      const idx = Number(match[1]) - 1;
      if (selectedRoute === "route1" && stopsRoute1[idx]) return stopsRoute1[idx];
      if (selectedRoute === "route2" && stopsRoute2[idx]) return stopsRoute2[idx];
    }
    return stationString; // fallback
  }

  // รับข้อมูลจาก websocket  ================================================
  const { messages } = useWebSocketData() as {
    messages: WebSocketMessage | null;
  };
  const data: BusData | null = useMemo(() => {
    return messages && messages.status === "ok" ? messages.data : null;
  }, [messages]);

  ////////// test polyline state ///////////////////////
  const [polylinePath, setPolylinePath] = useState<google.maps.LatLngLiteral[]>(
    []
  );
  //////////////////////////////////////////////////////

  // ตำแหน่งของผู้ใช้งาน  ================================================
  const [isOpen, setIsOpen] = useState(false);
  const location = useUserLocation();

  // markers รถเจม ==================================================================================================
  // เซ็ท marker ที่เลือก
  const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(
    null
  );
  // handle คลิก markers
  const handleMarkerClick = useCallback(
    (key: string, value: TrackerData) => {
      const [lat, lng] = value.position.split(",").map(Number);
      setSelectedMarker({ key, value });
      setCenter({ lat, lng });
      setShouldResetCenter(true);
    },
    [setShouldResetCenter, setCenter]
  );
  // reset center
  useEffect(() => {
    if (center) {
      // This will run after the component has re-rendered with the new center
      const timer = setTimeout(() => {
        setCenter(null);
        setShouldResetCenter(false);
      }, 0);

      // Cleanup the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [center, shouldResetCenter]);

  // handle ปิด infowindow
  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  ////////////// test polyline path ///////////////////////
  const updatePolylinePath = useCallback(
    (route: string) => {
      if (!polylines?.data) {
        return setPolylinePath([]);
      }
      const polylineSelected = polylines.data
        .filter((polyline) => polyline.name === route)
        .flatMap((polyline) => polyline.path);
      setPolylinePath(polylineSelected);
    },
    [polylines]
  );
  /////////////////////////////////////////////////////////

  useEffect(() => {
    updatePolylinePath(selectedRoute || "");
  }, [selectedRoute, updatePolylinePath, setLoading]);

  // Utility to create a circular image from a given URL
  function createCircularIcon(url: string, size: number = 40): Promise<string> {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, size, size);
          ctx.save();
          ctx.beginPath();
          ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, 0, 0, size, size);
          ctx.restore();
          resolve(canvas.toDataURL());
        } else {
          resolve(url); // fallback
        }
      };
      img.onerror = function () {
        // fallback: use circular default icon
        if (url !== userIcon) {
          createCircularIcon(userIcon, size).then(resolve);
        } else {
          resolve(url);
        }
      };
      img.src = url;
    });
  }

  const [userMarkerIcon, setUserMarkerIcon] = useState(userInfo?.picture || userIcon);
  const [circularUserMarkerIcon, setCircularUserMarkerIcon] = useState(userMarkerIcon);

  useEffect(() => {
    setUserMarkerIcon(userInfo?.picture || userIcon);
  }, [userInfo]);

  // Preload the image and fallback if error
  useEffect(() => {
    if (!userInfo?.picture) return;
    const img = new window.Image();
    img.src = userInfo.picture;
    img.onerror = () => setUserMarkerIcon(userIcon);
  }, [userInfo]);

  // Create circular icon whenever userMarkerIcon changes
  useEffect(() => {
    createCircularIcon(userMarkerIcon, 40).then(setCircularUserMarkerIcon);
  }, [userMarkerIcon]);

  const userMarker = useMemo(() => {
    if (
      location &&
      location.lat &&
      location.lng &&
      window.google &&
      window.google.maps &&
      window.google.maps.Size
    ) {
      return (
        <>
          <Marker
            key="user-location"
            position={{ lat: location.lat, lng: location.lng }}
            title="Your Location"
            onClick={() => {
              setIsOpen(true);
            }}
            icon={{
              url: circularUserMarkerIcon,
              scaledSize: window.google.maps.Size
                ? new window.google.maps.Size(40, 40)
                : null,
              origin: window.google.maps.Point
                ? new window.google.maps.Point(0, 0)
                : null,
              anchor: window.google.maps.Point
                ? new window.google.maps.Point(20, 20)
                : null,
            }}
          />
          {isOpen && (
            <InfoWindow
              position={{ lat: location.lat, lng: location.lng }}
              onCloseClick={() => setIsOpen(false)}
              headerContent={t('navbar.busMarker.currentLocation')}
            ></InfoWindow>
          )}
        </>
      );
    }
    return null;
  }, [location, isOpen, setLoading, circularUserMarkerIcon, t]);

  const [gemscarselected, setgemscarselected] = useState<BusData | null>(null);

  // Keep this useMemo for other markers ตำแหน่งรถเจม
  const markers = useMemo(() => {
    if (!data) return null;
    let filteredData = Object.entries(data);

    if (selectedRoute === "route1") {
      filteredData = filteredData.filter(
        ([key]) =>
          key === "01" ||
          key === "02" ||
          key === "03" ||
          key === "04" ||
          key === "05" ||
          key === "06" ||
          key === "07" ||
          key === "08" ||
          key === "09" ||
          key === "10" ||
          key === "11" ||
          key === "12" ||
          key === "13" ||
          key === "14"
      );
    }

    if (selectedRoute === "route2") {
      filteredData = filteredData.filter(
        ([key]) => key === "15" || key === "16"
      );
    }

    setgemscarselected(Object.fromEntries(filteredData));

    return filteredData.map(([key, value]) => {
      if (value && value.position && window.google.maps) {
        const [lat, lng] = value.position.split(",").map(Number);
        if (!isNaN(lat) && !isNaN(lng) && window.google.maps.Size) {
          return (
            <React.Fragment key={key}>
              <Marker
                position={{ lat, lng }}
                title={t("navbar.busMarker.busNumber", { key })} // Use translation for title
                onClick={() => handleMarkerClick(key, value)}
                icon={busIcon(value.direction)}
                zIndex={1000} // Higher zIndex for vehicle markers
              />
              {selectedMarker && selectedMarker.key === key && (
                <InfoWindow
                  position={{ lat, lng }}
                  onCloseClick={handleInfoWindowClose}
                  headerContent={t("navbar.busMarker.busNumber", { key })} // Use translation for header content
                >
                  <div>
                    <p>{t("navbar.busMarker.direction", { direction: value.direction })}</p>
                    <p>{t("navbar.busMarker.speed", { speed: value.speed })}</p>
                    <p>
                      {t("navbar.busMarker.currentStation", { station: getStationName(value.currentStation) })}
                    </p>
                    <p>
                      {t("navbar.busMarker.incomingStation", { station: getStationName(value.incomingStation) })}
                    </p>
                    {/* Uncomment and use below translations as needed */}
                    {/* <p>{t('incomingEta', { minutes: value.incomingEta })}</p> */}
                    {/* <p>{t('trackerTime', { time: value.tracker_time })}</p> */}
                    {/* <p>{t('serverTime', { time: value.server_time })}</p> */}
                  </div>
                </InfoWindow>
              )}
            </React.Fragment>
          );
        }
      }
      return null;
    });
  }, [
    data,
    handleMarkerClick,
    selectedMarker,
    handleInfoWindowClose,
    selectedRoute,
  ]);

  const filteredStations = useMemo(() => {
    if (!stations || !stations.data) return [];
    return stations.data.filter((station: { route: string }) => {
      if (selectedRoute === "route1") {
        return station.route === "route 1&2" || station.route === "route 1";
      } else if (selectedRoute === "route2") {
        return station.route === "route 2" || station.route === "route 1&2";
      } else {
        return true; // This will include all stations if no route is selected
      }
    });
  }, [stations, selectedRoute]);

  const iconStation1 = "/busstopicon.png";
  const iconStation2 = "/busstopicon2.png";

  return (
    <>
      <div className="h-0">
        <APIProvider apiKey={MAPAPIKEY} libraries={["places"]}>
          <Map
            style={{ width: "100%", height: "100vh" }}
            defaultZoom={15}
            defaultCenter={{ lat: 20.051005, lng: 99.894997 }}
            center={center}
            mapId={MAPID}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          />

          {/* markerรถเจม */}
          {markers}

          {/* marker ผู้ใช้งาน */}
          {userMarker}

          {/* station markers */}

          {selectedRoute === "route1" ? (
            <StationMarker
              position={filteredStations}
              selectedMarker={selectedstationMarker}
              setSelectedMarker={setselectedstationMarker}
              setCenter={setCenter}
              setStation={setStations}
              urlMarker={iconStation1}
              busData={gemscarselected}
            />
          ) : (
            <StationMarker
              position={filteredStations}
              selectedMarker={selectedstationMarker}
              setSelectedMarker={setselectedstationMarker}
              setCenter={setCenter}
              setStation={setStations}
              urlMarker={iconStation2}
              busData={gemscarselected}
            />
          )}
          <PolylineComponent
            path={polylinePath}
            color={selectedRoute === "route1" ? "#8b090c" : "#e2b644"}
          />
        </APIProvider>
      </div>
    </>
  );
};

export default MapComponant;

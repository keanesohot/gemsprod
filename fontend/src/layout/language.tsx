import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation files (for example: en.json, th.json)
const resources = {
  en: {
    translation: {
      stationinfodialog: {
        origin: "Origin",
        to: "To",
        destination: "Destination",
      },

      
      navbar: {
        logoutDialog: {
          title: "Sign out",
          text: "Are you sure?",
          confirm: "Yes",
          cancel: "No",
        },
        route: {
          route1: "Line 1",
          route2: "Line 2",
        },
        closeButton: "Close",
        lineInfo: {
          button: "Line Info",
          title: "Line Information",
          close: "Close",
          route1: [
            "Dormitory Lamduan 2",
            "Dormitory Lamduan 7 (Exit)",
            "Junction 3 (Staff House)",
            "Phiphitthaphan D2 Building",
            "Dormitory Chin (Entrance)",
            "Chinese Center (Entrance)",
            "F Courtyard",
            "D1 Building",
            "Swimming Pool",
            "E2 Building (Entrance)",
            "C4 Meeting Room",
            "C5 Building",
            "E2 Building (Exit)",
            "M-square Building",
            "Chinese Center (Exit)",
            "Dormitory Chin (Exit)",
            "Lamduan Center",
            "Swimming Pool Entrance",
            "Dormitory Lamduan 7 (Entrance)",
            "Lamduan Canteen Center",
            "7-11 Lamduan"
          ],
          route2: [
            "Dormitory Lamduan 2",
            "Dormitory Lamduan 7 (Exit)",
            "Junction 3 (Staff House)",
            "Phiphitthaphan D2 Building",
            "Dormitory Chin (Entrance)",
            "Chinese Center (Entrance)",
            "F Courtyard",
            "D1 Building",
            "Swimming Pool",
            "E2 Building (Entrance)",
            "E2 Building (Exit)",
            "M-square Building",
            "Chinese Center (Exit)",
            "Dormitory Chin (Exit)",
            "Lamduan Center",
            "Swimming Pool Entrance",
            "Dormitory Lamduan 7 (Entrance)",
            "Lamduan Canteen Center",
            "7-11 Lamduan",
            "Mae Fah Luang University Hospital"
          ]
        },
        user: {
          unknownName: "User Name",
          feedback: "Feedback"
        },
        infodialog: {
          busArrival: "Bus will arrive at your stop in {{minutes}} mins",
          busArrivalError: "Bus will arrive at your stop in ? mins",
          closestStation: "Closest station: {{stationName}} {{distance}} m.",
          findingLocation: "Finding your location...",
          distanceInfo: "About: {{distance}} meters away",
          etaInfo: "ETA: {{eta}} mins",
          markerInfo: "Station {{markerKey}}",
          selectMarker: "Please select a Station",
          searchPlaceholder: "Search for a Station",
          closeSearch: "Close",
        },



        // station กับ bus marker ไม่เกี่ยวกับ navbar แต่ต้องเอาใส่ใน navbar เพราะใส้ข้างนอกแล้วใช้ไม่ได้ ฝากแก้หน่อยนะ 555555555 ===================================
        stationMarker: {
          markerTitle: "Station: {{stationId}}",
          infoWindowHeader: "Station: {{stationId}} - {{stationName}}",
          waitingPassengers: "People waiting now: {{waitingLength}} people",
          nearbyBus: "Gems bus {{busId}} nearby, {{distance}} meters away",
          noBus: "No buses in the vicinity",
        },
        busMarker: {
          busNumber: "Bus number: {{key}}",
          direction: "Direction: {{direction}} degrees",
          speed: "Speed: {{speed}} km/h",
          currentStation: "Current station: {{station}}",
          incomingStation: "Next station: {{station}}",
          incomingEta: "Arriving at next station in {{minutes}} minutes",
          trackerTime: "Tracker time: {{time}}",
          serverTime: "Server time: {{time}}",
          busId: "Bus ID: {{busId}}",
          noBus: "No buses nearby",
          currentLocation: "You are here"
        },
        feedbackDialog: {
          title: "We need your feedback",
          placeholder: "Enter your feedback...",
          cancel: "Cancel",
          submit: "Submit",
          submitting: "Submitting...",
          error: "An error occurred while submitting feedback. Please try again."
        },
        cookieModal: {
          title: "We Value Your Privacy",
          body1: "This website uses cookies to improve your experience. By continuing to use this website, you agree to our cookie policy.",
          body2: "We may also collect additional information such as your email, name, and location. This data will be used to enhance our services and may be utilized to train AI models for predictive analysis in the future. Your privacy is important to us, and we ensure that your data will be handled securely and in compliance with relevant regulations.",
          accept: "Accept and Continue"
        }
      },
    },
  },

  th: {
    translation: {
      stationinfodialog: {
        origin: "ต้นทาง",
        to: "ถึง",
        destination: "ปลายทาง",
      },
      navbar: {
        logoutDialog: {
          title: "ออกจากระบบ",
          text: "คุณแน่ใจหรือ?",
          confirm: "ใช่",
          cancel: "ไม่ใช่",
        },
        route: {
          route1: "สาย 1",
          route2: "สาย 2",
        },
        closeButton: "ปิด",
        lineInfo: {
          button: "ข้อมูลเส้นทางรถ",
          title: "ข้อมูลเส้นทางรถ",
          close: "ปิด",
          route1: [
            "จุดหอพักลำดวน 2",
            "จุดหอพักลำดวน 7 ขาออก",
            "จุด 3 แยกบ้านพักบุคลากร",
            "จุดอาคารพิพิธภัณฑ์ D2",
            "จุดหอพักจีน ขาเข้า",
            "จุดศูนย์จีน ขาเข้า",
            "จุดลานจอด F",
            "จุดอาคาร D1",
            "จุดสระว่ายน้ำ",
            "จุดอาคาร E2 ขาเข้า",
            "จุดห้องประชุม C4",
            "จุดอาคาร C5",
            "จุดอาคาร E2 ขาออก",
            "จุดอาคาร M-square",
            "จุดศูนย์จีน ขาออก",
            "จุดหอพักจีน ขาออก",
            "จุดศูนย์ลำดวน",
            "จุดทางเข้าสระว่ายน้ำ",
            "จุดหอพักลำดวน 7 ขาเข้า",
            "จุดศูนย์อาหารลำดวน",
            "จุด 7-11 ลำดวน"
          ],
          route2: [
            "จุดหอพักลำดวน 2",
            "จุดหอพักลำดวน 7 ขาออก",
            "จุด 3 แยกบ้านพักบุคลากร",
            "จุดอาคารพิพิธภัณฑ์ D2",
            "จุดหอพักจีน ขาเข้า",
            "จุดศูนย์จีน ขาเข้า",
            "จุดลานจอด F",
            "จุดอาคาร D1",
            "จุดสระว่ายน้ำ",
            "จุดอาคาร E2 ขาเข้า",
            "จุดอาคาร E2 ขาออก",
            "จุดอาคาร M-square",
            "จุดศูนย์จีน ขาออก",
            "จุดหอพักจีน ขาออก",
            "จุดศูนย์ลำดวน",
            "จุดทางเข้าสระว่ายน้ำ",
            "จุดหอพักลำดวน 7 ขาเข้า",
            "จุดศูนย์อาหารลำดวน",
            "จุด 7-11 ลำดวน",
            "จุดโรงพยาบาล ม.แม่ฟ้าหลวง"
          ]
        },
        user: {
          unknownName: "ชื่อผู้ใช้",
          feedback: "แสดงความคิดเห็น"
        },
        infodialog: {
          busArrival: "รถจะถึงป้ายคุณในอีก {{minutes}} นาที",
          busArrivalError: "รถจะถึงป้ายคุณในอีก ? นาที",
          closestStation: "ป้ายที่ใกล้คุณ {{stationName}} {{distance}} เมตร",
          findingLocation: "กำลังหาตำแหน่งของคุณ...",
          distanceInfo: "ห่างประมาณ {{distance}} เมตร",
          etaInfo: "ใช้เวลาประมาณ {{eta}} นาที",
          markerInfo: "ป้ายหมายเลข {{markerKey}}",
          selectMarker: "โปรดเลือกป้ายที่จะไป",
          searchPlaceholder: "ค้นหาป้าย",
          closeSearch: "ปิด",
        },
        stationMarker: {
          markerTitle: "ป้ายหมายเลข: {{stationId}}",
          infoWindowHeader: "ป้ายหมายเลข {{stationId}} - {{stationName}}",
          waitingPassengers: "คนที่รอในขณะนี้: {{waitingLength}} คน",
          nearbyBus: "มีรถ Gems หมายเลข {{busId}} อยู่ใกล้เคียงในระยะ {{distance}} เมตร",
          noBus: "ไม่มีรถในระยะ",
        },
        busMarker: {
          busNumber: "รถเจมหมายเลข: {{key}}",
          direction: "ทิศทาง: {{direction}} องศา",
          speed: "ความเร็ว: {{speed}} กม./ชม.",
          currentStation: "สถานีปัจจุบัน: {{station}}",
          incomingStation: "สถานีต่อไป: {{station}}",
          incomingEta: "จะถึงสถานีต่อไปอีก {{minutes}} นาที",
          trackerTime: "เวลา Tracker: {{time}}",
          serverTime: "เวลา Server: {{time}}",
          busId: "รหัสรถ: {{busId}}",
          noBus: "ไม่มีรถใกล้สถานีนี้",
          currentLocation: "คุณอยู่ตรงนี้"
        },
        feedbackDialog: {
          title: "เราต้องการความคิดเห็นของคุณ",
          placeholder: "กรอกความคิดเห็นของคุณ...",
          cancel: "ยกเลิก",
          submit: "ส่ง",
          submitting: "กำลังส่ง...",
          error: "เกิดข้อผิดพลาดขณะส่งความคิดเห็น กรุณาลองใหม่อีกครั้ง"
        },
        cookieModal: {
          title: "เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ",
          body1: "เว็บไซต์นี้ใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณ การใช้งานเว็บไซต์นี้ต่อไปถือว่าคุณยอมรับนโยบายคุกกี้ของเรา",
          body2: "เราอาจเก็บข้อมูลเพิ่มเติม เช่น อีเมล ชื่อ และตำแหน่งของคุณ ข้อมูลนี้จะถูกใช้เพื่อพัฒนาบริการของเรา และอาจนำไปใช้ฝึก AI เพื่อการวิเคราะห์เชิงคาดการณ์ในอนาคต ความเป็นส่วนตัวของคุณสำคัญสำหรับเรา และเราจะดูแลข้อมูลของคุณอย่างปลอดภัยและเป็นไปตามข้อกำหนดที่เกี่ยวข้อง",
          accept: "ยอมรับและดำเนินการต่อ"
        }
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  interpolation: {
    escapeValue: false, // React already does escaping
  },
});

export default i18n;

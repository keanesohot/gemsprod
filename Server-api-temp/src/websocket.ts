import WebSocket from "ws";
import axios from "axios";
import { getStationDataFromDatabase } from "./controllers/station_controllers";
import Station from "./models/station_model";
import { IncomingMessage } from "http";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import { findUserById } from "./service/user.service";


dotenv.config();

const BEARER_TOKEN = process.env.BEARER_TOKEN;
const JWT_SECRET = process.env.TOKEN_KEY || "kimandfamily";

interface AuthenticatedWebSocket extends WebSocket {
  isAuthenticated?: boolean;
  userId?: string;
  roles?: string;
}

interface TokenPayload {
  id: string;
  roles: string;
}

// ========== GLOBAL BUS DATA BROADCAST =============
let latestBusData: any = null;
let busClients: Set<WebSocket> = new Set();
let isFetching = false; // ป้องกัน concurrent requests
let consecutiveErrors = 0; // นับ error ต่อเนื่อง
let lastFetchTime = 0; // เวลาที่ดึงข้อมูลล่าสุด

const fetchAndBroadcastBusData = async () => {
  // ป้องกัน concurrent requests
  if (isFetching) {
    console.log("Skipping fetch - already in progress");
    return;
  }

  isFetching = true;
  const startTime = Date.now();

  try {
    const response = await axios.get(
      "https://www.ppgps171.com/mobile/api/mfutransit",
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
        timeout: 5000, // timeout 5 วินาที
      }
    );

    // ตรวจสอบว่าข้อมูลใหม่หรือไม่
    const newData = response.data;
    const hasChanged = JSON.stringify(newData) !== JSON.stringify(latestBusData);
    
    if (hasChanged) {
      latestBusData = newData;
      lastFetchTime = startTime;
      consecutiveErrors = 0; // reset error count
      
      // broadcast to all connected clients
      let broadcastCount = 0;
      busClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          try {
            client.send(JSON.stringify(latestBusData));
            broadcastCount++;
          } catch (sendError) {
            console.error("Error sending to client:", sendError);
            busClients.delete(client); // ลบ client ที่มีปัญหา
          }
        }
      });
      
      console.log(`Broadcasted to ${broadcastCount} clients in ${Date.now() - startTime}ms`);
    } else {
      console.log("No data change detected");
    }

  } catch (error) {
    consecutiveErrors++;
    console.error(`Error fetching bus data (attempt ${consecutiveErrors}):`, error);
    
    // ถ้า error มากเกินไป ให้เพิ่ม interval
    if (consecutiveErrors >= 5) {
      console.warn("Too many consecutive errors, consider checking API status");
    }
  } finally {
    isFetching = false;
  }
};

// Dynamic interval based on error count
const getInterval = () => {
  if (consecutiveErrors >= 3) {
    return 20000; // 20 วินาทีถ้า error มาก
  }
  return 5000; // 5 วินาทีปกติ
};

// Start global interval with dynamic timing
let intervalId = setInterval(fetchAndBroadcastBusData, getInterval());

// Update interval based on error count
setInterval(() => {
  const newInterval = getInterval();
  clearInterval(intervalId);
  intervalId = setInterval(fetchAndBroadcastBusData, newInterval);
}, 5000); // ตรวจสอบทุก 5 วินาที

export const setupWebSocket = (server: any) => {
  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', async function upgrade(request: IncomingMessage, socket: any, head: Buffer) {
    const protocols = request.headers['sec-websocket-protocol'];
    const token = protocols ? protocols.split(',')[0].trim() : null;

    if (!token) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    try {
      const verified = jwt.verify(token, JWT_SECRET) as TokenPayload;
      if (!verified) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      const user = await findUserById(verified.id);
      if (!user) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(request, socket, head, function done(ws: AuthenticatedWebSocket) {
        ws.isAuthenticated = true;
        ws.userId = user.id;
        ws.roles = user.role;
        wss.emit('connection', ws, request);
      });
    } catch (error) {
      console.error('Token verification failed:', error);
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
    }
  });

  wss.on('connection', (ws: AuthenticatedWebSocket, request: IncomingMessage) => {
    console.log(`New connection established. Authenticated: ${ws.isAuthenticated}, User ID: ${ws.userId}`);
    
    const url = new URL(request.url!, `http://${request.headers.host}`);
    const pathname = url.pathname;

    if (pathname === "/busws") {
      handleBusWsConnection(ws);
    } else if (pathname === "/stationws") {
      if (ws.roles === "ADMIN" || ws.roles==="STAFF") {
        handleStationWsConnection(ws);
      } else {
        ws.close(1008, "Forbidden: Admins only");
      }
    } else {
      ws.close(1008, "Invalid endpoint");
    }
  });
};

const handleBusWsConnection = (ws: WebSocket) => {
  console.log("Client connected to /busws");
  busClients.add(ws);
  // ส่งข้อมูลล่าสุดให้ client ที่เพิ่งเชื่อมต่อ
  if (latestBusData) {
    ws.send(JSON.stringify(latestBusData));
  }

  ws.on("message", (message) => {
    console.log("Received message on /busws:", message);
  });

  ws.on("close", () => {
    console.log("Client disconnected from /busws");
    busClients.delete(ws);
  });
};

const handleStationWsConnection = (ws: WebSocket) => {
  console.log("Client connected to /stationws");

  const sendStationData = async () => {
    try {
      const stationData = await getStationDataFromDatabase();
      ws.send(JSON.stringify(stationData));
    } catch (error) {
      console.error("Error fetching station data:", error);
    }
  };

  sendStationData();

  const changeStream = Station.watch();

  changeStream.on('change', async (change: any) => {
    console.log('Detected change in stations collection');
    await sendStationData();
  });

  ws.on("message", (message) => {
    console.log("Received message on /stationws:", message);
  });

  ws.on("close", () => {
    console.log("Client disconnected from /stationws");
    changeStream.close();
  });
};

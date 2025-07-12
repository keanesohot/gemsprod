import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router } from "./routes/routes";
import { authroute } from "./routes/authroutes";
import { logger } from "./middle/log";
import http from "http";
import cors from "cors";
import cron from "node-cron";
import { cleanStationWaitingLists } from "./service/cleanStation";
import { setupWebSocket } from "./websocket";
import userroute from "./routes/adminfuncroutes";

dotenv.config();
console.log("REDIRECTURL:", process.env.REDIRECTURL);
console.log("CLIENT_ID:", process.env.CLIENT_ID);
console.log("SECRET_ID:", process.env.SECRET_ID);
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const FONTENDURL = process.env.FONTENDURL || "https://shutter.mfu.ac.th";
console.log("Fontendurl : " + FONTENDURL);

app.use(
  cors({
    origin: [FONTENDURL, "https://shutter.mfu.ac.th"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

const mongoDBUrl = process.env.MONGODB_URL;
console.log(mongoDBUrl);

if (!mongoDBUrl) {
  throw new Error("MONGODB_URL environment variable is not set!");
}

mongoose
  .connect(mongoDBUrl)
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.error(`Error details: ${err}`));

// Middleware log
app.use(logger);
app.use("/", router);
app.use("/users", authroute);
app.use("/adminfunc",userroute);
app.use("/guests", authroute);

const PORT = process.env.PORT || 4444;

// Create HTTP server
const server = http.createServer(app);

// Set up WebSocket server
setupWebSocket(server); // Call the setup function

// Schedule the task to run every 1 minute
cron.schedule("* * * * *", async () => {
  console.log("Running station waiting list cleanup");
  await cleanStationWaitingLists();
});

// Use server.listen instead of app.listen
server.listen(PORT, () => {
  console.log(`Server is rocking at ${PORT}`);
});
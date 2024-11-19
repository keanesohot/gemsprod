import mongoose, { Collection } from "mongoose";

interface GuestActivity {
    name: string;
    location: string;
    stationMarker: string;
    time: Date;
    route: string;
    destinationMarker: string;
  }

const guestActivitySchema = new mongoose.Schema(
    {
      name: { type: String, required: true},
      location: { type: String, required: true },
      stationMarker: { type: String, required: true },
      time: { type: Date, required: false },
      route: { type: String, required: true },
      destinationMarker: { type: String, required: false },
    },
    { collection: "guest_activities" }
  );

  interface GuestActivityDocument extends mongoose.Document {
    name: string;
    location: string;
    stationMarker: string;
    time: Date;
    route: string;
    destinationMarker: string;
  }

  const GuestActivity = mongoose.model<GuestActivityDocument>("GuestActivity", guestActivitySchema);

export default GuestActivity;
export { GuestActivity, GuestActivityDocument };
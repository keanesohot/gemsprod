import express, { Request, Response } from "express";
import { addStationController, addUserToStationscontoller, deleteStationController, getStations, updateStationController } from "../controllers/station_controllers";
import { getPolylines } from "../controllers/polyline_controller";
import { createFeedback, getAllFeedbacks } from '../controllers/feedback.controller';
import { auth } from '../service/auth.service';
import { admin_middleware, auth_middleware, staff_middleware } from '../middle/auth';
import { addActivity, getTotalUsers } from '../controllers/user.controller';
import { createGuest, getGuestByIdController, getGuests, guestRoleController, logGuestActivityController } from '../controllers/guest.controllers';
import { findGuestById, getGuestById } from '../service/guest.service';
import { get } from 'http';


const router = express.Router();


// Activity request api
router.post("/activity", addActivity);



//Get request
router.get("/", async (req: Request, res: Response) => {
  try {
   
    res.status(200).json({
      data: "Hello",
    });
  } catch (err) {
    console.log("Error something" + err)
  }
});

// guest
router.post("/createGuest", createGuest);
router.get("/getGuests", getGuests);
router.get("/getGuest/:id", getGuestByIdController);

router.post("/logGuestActivity", logGuestActivityController);


// station
router.get('/getStation', getStations);
router.post('/addusertoStaion',auth_middleware ,addUserToStationscontoller);


// add station
router.post('/stations/add', staff_middleware ,addStationController);


// update station
router.patch('/updatestations/:id', staff_middleware, updateStationController);


// delete station
router.delete('/deletestations/:id', staff_middleware, deleteStationController);


// get polyline
router.get('/getPolyline', getPolylines);



//feedback
router.post('/createFeedback',admin_middleware ,createFeedback);
router.get('/getFeedback', admin_middleware ,getAllFeedbacks)

//user
router.get('/getTotalUsers',admin_middleware, getTotalUsers);


export default router;
export { router }
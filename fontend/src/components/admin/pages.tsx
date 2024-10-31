import Dashboard from "./Dashboard/Dashboard";
import Table from "./Table/Table";
import Summary from "./Summary/schedule";
import { RouteObject } from "react-router-dom";
import FeedBack from "./FeedBack/page";

  
  // ? use this function to create admin routes
  const createAdminRoutes = (): RouteObject[] => [
    { path: "dashboard", element: <Dashboard  /> },
    { path: "mark-pin", element: <Table  /> },
    { path: "feedback", element: <FeedBack /> },
    { path: "summary", element: <Summary /> },
  ];
  
  export default createAdminRoutes;
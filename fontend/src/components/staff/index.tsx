import { RouteObject } from "react-router-dom";
import Dashboard from "../admin/Dashboard/Dashboard";
import Table from "../admin/Table/Table";

const createStaffRoutes = (): RouteObject[] => [
    { path: "dashboard", element: <Dashboard  /> },
    { path: "mark-pin", element: <Table  /> },
  ];
  
  export default createStaffRoutes;
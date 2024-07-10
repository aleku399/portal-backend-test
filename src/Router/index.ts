import { Router } from "express";
import EmployeeRoutes from "./employee";
import SalaryRoutes from "./salary";
import AuthRoutes from "./auth";

const router = Router();

export default (): Router => {
  EmployeeRoutes (router);
  SalaryRoutes (router);
  AuthRoutes (router);

  return router;
};

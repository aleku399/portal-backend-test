import { Router } from "express";
import { JWTAuthMiddleWare } from "../utils/auth";
import {
  handleGetEmployees,
  handleGetEmployee,
  handleCreateEmployee,
  handleUpdateEmployee,
  handleUpdateEmployeePassword,
  handleDeleteEmployee,
} from "../Controllers/employee";


export default (router: Router) => {
  const employeePrefix = "/employees";

  router.get(`${employeePrefix}`, JWTAuthMiddleWare, handleGetEmployees);

  router.get(`${employeePrefix}/:id`, JWTAuthMiddleWare, handleGetEmployee);

  router.post(`${employeePrefix}`, JWTAuthMiddleWare, handleCreateEmployee);

  router.put(`${employeePrefix}/:id`, JWTAuthMiddleWare, handleUpdateEmployee);

  router.put(`${employeePrefix}/:id/password`, JWTAuthMiddleWare, handleUpdateEmployeePassword);

  router.delete(`${employeePrefix}/:id`, JWTAuthMiddleWare, handleDeleteEmployee);
};

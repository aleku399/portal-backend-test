import { Router } from "express";
import { JWTAuthMiddleWare } from "../utils/auth";
import {
  handleGetSalaries,
  handleGetSalary,
  handleCreateSalary,
  handleUpdateSalary,
  handleDeleteSalary,
} from "../Controllers/salary";

export default (router: Router) => {
  const salaryPrefix = "/salaries";

  router.get(`${salaryPrefix}`, JWTAuthMiddleWare, handleGetSalaries);

  router.get(`${salaryPrefix}/:id`, JWTAuthMiddleWare, handleGetSalary);

  router.post(`${salaryPrefix}`, JWTAuthMiddleWare, handleCreateSalary);

  router.put(`${salaryPrefix}/:id`, JWTAuthMiddleWare, handleUpdateSalary);

  router.delete(`${salaryPrefix}/:id`, JWTAuthMiddleWare, handleDeleteSalary);
};

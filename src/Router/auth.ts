import { Router } from "express";
import { handleRegisterEmployee, handleEmployeeLogin } from "../Controllers/auth";

export default (router: Router) => {
    router.post("/register", handleRegisterEmployee);
    router.post("/login", handleEmployeeLogin);  
};

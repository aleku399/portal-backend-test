import { Request, Response } from "express";
import { Employee, createEmployee } from "../entity/Employee";
import { customPayloadResponse, hashPassword,  validatePassword,  getAuthAccessToken } from "../utils/auth";
import { validateFields } from "../utils";

export const handleRegisterEmployee = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone, department } = req.body;

    const validationError = validateFields({ firstName, lastName, email, password, phone, department });
    if (validationError) {
      return res.status(400).json(customPayloadResponse(false, validationError));
    }

    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json(customPayloadResponse(false, "Employee Already Exists"));
    }

    const hashedPassword = await hashPassword(password, 10);
    if (!hashedPassword) {
      return res.status(500).json(customPayloadResponse(false, "An Error Occurred"));
    }

    const newEmployee = await createEmployee(firstName, lastName, email, hashedPassword, phone, department);
    if (!newEmployee) {
      return res.status(500).json(customPayloadResponse(false, "Failed to create employee"));
    }

    const accessToken = getAuthAccessToken(newEmployee, process.env.ACCESS_TOKEN_SECRET);

    return res.status(200).json(customPayloadResponse(true, { token: accessToken, employee: newEmployee }));
  } catch (error) {
    console.error("Error in handleRegisterEmployee:", error);
    return res.status(500).json(customPayloadResponse(false, "An Error Occurred"));
  }
};

export const handleEmployeeLogin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
  
      const employee = await Employee.findOne({ where: { email } });
      if (!employee) {
        return res.status(400).json(customPayloadResponse(false, "Employee Not found"));
      }

      console.log("employee", employee.password);
  
      const passwordMatch = await validatePassword(password, employee.password);
      if (!passwordMatch) {
        return res.status(400).json(customPayloadResponse(false, "Password is Incorrect!"));
      }
  
      const accessToken = getAuthAccessToken(employee, process.env.ACCESS_TOKEN_SECRET);
  
      return res.status(200).json(customPayloadResponse(true, { token: accessToken, employee }));
    } catch (error) {
      console.error("Error in handleEmployeeLogin:", error);
      return res.status(500).json(customPayloadResponse(false, "An Error Occurred"));
    }
  };

import { Response, Request } from "express";
import {
  Employee, 
  findEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  listEmployees,
  updateEmployeePassword,
} from "../entity/Employee";
import {
  customPayloadResponse,
  hashPassword,
  getAuthAccessToken,
} from "../utils/auth";
import { validateFields } from "../utils";

export const handleCreateEmployee = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone, department } = req.body;

    const validationError = validateFields({ firstName, lastName, email, password, phone, department });
    if (validationError) {
      return res.status(200).json(customPayloadResponse(false, validationError)).end();
    }

    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(200).json(customPayloadResponse(false, "Employee Already Exists")).end();
    }

    const hashedPassword = await hashPassword(password, 10);
    if (!hashedPassword) {
      return res.status(200).json(customPayloadResponse(false, "An Error Occurred")).end();
    }

    const newEmployee = await createEmployee(firstName, lastName, email, hashedPassword, phone, department);
    const accessToken = getAuthAccessToken(newEmployee, process.env.ACCESS_TOKEN_SECRET);

    return res.status(200).json(customPayloadResponse(true, { token: accessToken, employee: newEmployee })).end();
  } catch (error) {
    console.error(error);
    return res.status(200).json(customPayloadResponse(false, "An Error Occurred")).end();
  }
};

export const handleGetEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await listEmployees();
    return res.status(200).json(customPayloadResponse(true, employees)).end();
  } catch (error) {
    console.error(error);
    return res.status(200).json(customPayloadResponse(false, "An Error Occurred")).end();
  }
};

export const handleGetEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(200).json(customPayloadResponse(false, "Id Required")).end();
    }

    const employee = await findEmployeeById(parseInt(id));
    if (!employee) {
      return res.status(200).json(customPayloadResponse(false, "Employee Not Found")).end();
    }

    return res.status(200).json(customPayloadResponse(true, employee)).end();
  } catch (error) {
    console.error(error);
    return res.status(200).json(customPayloadResponse(false, "An Error Occurred")).end();
  }
};

export const handleUpdateEmployee = async (req: Request, res: Response) => {
  try {
    const { id, firstName, lastName, email, phone, department } = req.body;

    const validationError = validateFields({ id, firstName, lastName, email, phone, department });
    if (validationError) {
      return res.status(200).json(customPayloadResponse(false, validationError)).end();
    }

    const employee = await findEmployeeById(id);
    if (!employee) {
      return res.status(200).json(customPayloadResponse(false, "Employee Not Found")).end();
    }

    const updatedEmployee = await updateEmployee(id, firstName, lastName, email, phone, department);
    return res.status(200).json(customPayloadResponse(true, updatedEmployee)).end();
  } catch (error) {
    console.error(error);
    return res.status(200).json(customPayloadResponse(false, "An Error Occurred")).end();
  }
};

export const handleUpdateEmployeePassword = async (req: Request, res: Response) => {
  try {
    const { id, password } = req.body;

    const validationError = validateFields({ id, password });
    if (validationError) {
      return res.status(200).json(customPayloadResponse(false, validationError)).end();
    }

    const employee = await findEmployeeById(id);
    if (!employee) {
      return res.status(200).json(customPayloadResponse(false, "Employee Not Found")).end();
    }

    const hashedPassword = await hashPassword(password, 10);
    if (!hashedPassword) {
      return res.status(200).json(customPayloadResponse(false, "An Error Occurred")).end();
    }

    const updatedEmployee = await updateEmployeePassword(id, hashedPassword);
    return res.status(200).json(customPayloadResponse(true, updatedEmployee)).end();
  } catch (error) {
    console.error(error);
    return res.status(200).json(customPayloadResponse(false, "An Error Occurred")).end();
  }
};

export const handleDeleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(200).json(customPayloadResponse(false, "Id Required")).end();
    }

    await deleteEmployee(parseInt(id));
    return res.status(200).json(customPayloadResponse(true, "Employee Deleted")).end();
  } catch (error) {
    console.error(error);
    return res.status(200).json(customPayloadResponse(false, "An Error Occurred")).end();
  }
};

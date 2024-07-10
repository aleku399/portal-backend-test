import { Response, Request } from "express";
import { Salary, createSalary, findSalaryById, listSalaries, updateSalary, deleteSalary } from "../entity/Salary";
import { Employee } from "../entity/Employee";
import { customPayloadResponse } from "../utils/auth";
import { validateFields } from "../utils";

export const handleCreateSalary = async (req: Request, res: Response) => {
  try {
    const { employeeId, baseSalary, bonus, date } = req.body;

    const validationError = validateFields({ employeeId, baseSalary, bonus, date });
    if (validationError) {
      return res.status(400).json(customPayloadResponse(false, validationError));
    }

    const employee = await Employee.findOne({ where: { id: employeeId } });
    if (!employee) {
      return res.status(404).json(customPayloadResponse(false, "Employee not found"));
    }

    const newSalary = await createSalary(employeeId, baseSalary, bonus, date);
    return res.status(201).json(customPayloadResponse(true, newSalary));
  } catch (error) {
    console.error("Error creating salary:", error);
    return res.status(500).json(customPayloadResponse(false, "An error occurred"));
  }
};

export const handleGetSalaries = async (req: Request, res: Response) => {
  try {
    const salaries = await listSalaries();
    return res.status(200).json(customPayloadResponse(true, salaries));
  } catch (error) {
    console.error("Error fetching salaries:", error);
    return res.status(500).json(customPayloadResponse(false, "An error occurred"));
  }
};

export const handleGetSalary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validationError = validateFields({ id });
    if (validationError) {
      return res.status(400).json(customPayloadResponse(false, validationError));
    }

    const salary = await findSalaryById(parseInt(id));
    if (!salary) {
      return res.status(404).json(customPayloadResponse(false, "Salary not found"));
    }

    return res.status(200).json(customPayloadResponse(true, salary));
  } catch (error) {
    console.error("Error fetching salary:", error);
    return res.status(500).json(customPayloadResponse(false, "An error occurred"));
  }
};

export const handleUpdateSalary = async (req: Request, res: Response) => {
  try {
    const { id, baseSalary, bonus, date } = req.body;

    const validationError = validateFields({ id, baseSalary, bonus, date });
    if (validationError) {
      return res.status(400).json(customPayloadResponse(false, validationError));
    }

    const updatedSalary = await updateSalary(id, baseSalary, bonus, date);
    if (!updatedSalary) {
      return res.status(404).json(customPayloadResponse(false, "Salary not found"));
    }

    return res.status(200).json(customPayloadResponse(true, updatedSalary));
  } catch (error) {
    console.error("Error updating salary:", error);
    return res.status(500).json(customPayloadResponse(false, "An error occurred"));
  }
};

export const handleDeleteSalary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const validationError = validateFields({ id });
    if (validationError) {
      return res.status(400).json(customPayloadResponse(false, validationError));
    }

    await deleteSalary(parseInt(id));
    return res.status(200).json(customPayloadResponse(true, "Salary deleted"));
  } catch (error) {
    console.error("Error deleting salary:", error);
    return res.status(500).json(customPayloadResponse(false, "An error occurred"));
  }
};

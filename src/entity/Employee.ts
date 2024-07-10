import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm"

@Entity()
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  password!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  department!: string;
}

export const createEmployee = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    department: string
  ) => {
    const employee = new Employee();
    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.email = email;
    employee.password = password;
    employee.phone = phone;
    employee.department = department;
    await employee.save();
    return employee;
  };

  export const findEmployeeById = async (id: number) => {
    return Employee.findOne({
      where: { id },
    });
  };
  
  export const listEmployees = async () => {
    return Employee.find();
  };

  export const updateEmployee = async (
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    department: string
  ) => {
    const employee = await Employee.findOne({ where: { id } });
    if (!employee) return null;
    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.email = email;
    employee.phone = phone;
    employee.department = department;
    await employee.save();
    return employee;
  };
  
  export const updateEmployeePassword = async (id: number, password: string) => {
    const employee = await Employee.findOne({ where: { id } });
    if (!employee) throw new Error("Employee not found");
    employee.password = password;
    await employee.save();
    return employee;
  };
  
  export const deleteEmployee = async (id: number) => {
    const employee = await Employee.findOne({ where: { id } });
    if (!employee) throw new Error("Employee not found");
    await employee.remove();
    return true;
  };
  
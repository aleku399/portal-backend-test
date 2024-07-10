import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { Employee } from "./Employee";

@Entity()
export class Salary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, { eager: true })
  @JoinColumn({ name: "employeeId" })
  employee!: Employee;

  @Column()
  baseSalary!: number;

  @Column()
  bonus!: number;

  @Column()
  date!: Date;
}

export const createSalary = async (
  employeeId: number,
  baseSalary: number,
  bonus: number,
  date: Date
) => {
  const employee = await Employee.findOne({ where: { id: employeeId } });
  if (!employee) {
    throw new Error("Employee not found");
  }

  const salary = new Salary();
  salary.employee = employee;
  salary.baseSalary = baseSalary;
  salary.bonus = bonus;
  salary.date = date;
  await salary.save();
  return salary;
};

export const findSalaryById = async (id: number) => {
  return Salary.findOne({
    where: { id },
    relations: ["employee"],
  });
};

export const listSalaries = async () => {
  return Salary.find({ relations: ["employee"] });
};

export const updateSalary = async (
  id: number,
  baseSalary: number,
  bonus: number,
  date: Date
) => {
  const salary = await Salary.findOne({ where: { id } });
  if (!salary) {
    throw new Error("Salary not found");
  }

  salary.baseSalary = baseSalary;
  salary.bonus = bonus;
  salary.date = date;
  await salary.save();
  return salary;
};

export const deleteSalary = async (id: number) => {
  const salary = await Salary.findOne({ where: { id } });
  if (!salary) {
    throw new Error("Salary not found");
  }
  await salary.remove();
  return true;
};

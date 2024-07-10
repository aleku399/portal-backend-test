import "reflect-metadata";
import { DataSource } from "typeorm";
import { Employee } from "./entity/Employee";
import { Salary } from "./entity/Salary";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "alex",
  password: "alex",
  database: "practical_test",
  synchronize: true,
  logging: false,
  entities: [Employee, Salary],
  migrations: [],
  subscribers: [],
});

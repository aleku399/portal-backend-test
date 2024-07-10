import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./Router";
import { AppDataSource } from "./data-source";
import { Employee } from "./entity/Employee";

const app: Application = express();
export const PORT: string | number = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api", router());

AppDataSource.initialize()
  .then(async () => {

    console.log("Here you can setup and run express / fastify / any other framework.");
  })
  .catch((error) => console.log(error));

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});

export const dataSource = AppDataSource;

import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connect from "./config/database.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import { createServer } from "node:http";
import { initSocket } from "./socket/index.js";
import { mainV1Routes } from "./api/v1/routes/index.route.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server = createServer(app);

initSocket(server);

mainV1Routes(app);

connect().then(() => {
  server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});

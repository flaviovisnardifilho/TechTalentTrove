// import createError from "http-errors";
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import * as path from "path";
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import loginRouter from "./routes/login.js";
import blogRouter from "./routes/blog.js";
import adminRouter from "./routes/admin.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import {
  authenticateToken,
  isAdmin,
} from "./middleware/authMiddleware.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", loginRouter);
app.use("/", blogRouter);
app.use("/api",
    authenticateToken,
    isAdmin,
    adminRouter
    );

// app.use(notFound);
// app.use(errorHandler);

export default app;

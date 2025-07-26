import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

import connectDB from "./configs/configDatabase.js";
import router from "./routes/index.js";

import corsOptions from "./configs/corsOption.js";

const app = express();
const port = process.env.PORT || 5001;
// Middleware

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.static("public"));
// Connect to MongoDB
connectDB();

//config jwt

//router
app.use("/", router);

app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;

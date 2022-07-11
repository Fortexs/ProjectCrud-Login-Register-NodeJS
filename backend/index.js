import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/database.js";
import router from "./routes/index.js";
dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log('DAtabase terkoneksi');
} catch (error) {
    console.error(error);
}

app.listen(5000, ()=> console.log("server jalan"));
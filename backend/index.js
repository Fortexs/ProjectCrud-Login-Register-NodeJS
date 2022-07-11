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
    console.log('Database terkoneksi');
} catch (error) {
    console.error(error);
}


app.use(cors());
app.use(express.json());
app.use(router);
app.use(cookieParser());

app.listen(5000, ()=> console.log("server jalan"));
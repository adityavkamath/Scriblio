import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import userRouter from "./routes/userRoute";
import roomRouter from "./routes/roomRoute";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 8000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/user", userRouter);
app.use("/api/room", roomRouter);

app.listen(PORT, () => {
  console.log(`HTTP Server is running on http://localhost:${PORT}`);
});

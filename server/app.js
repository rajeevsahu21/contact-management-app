import express from "express";
import "dotenv/config";
import cors from "cors";

import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/auth.js";
import contactRoutes from "./routes/contact.js";

const app = express();
dbConnect();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use((err, req, res, next) => {
  if (err.stack) {
    return res
      .status(400)
      .json({ status: "failure", message: "Invalid request body" });
  }
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "API is working" });
});

app.use("/api/auth", authRoutes);
app.use(authMiddleware);
app.use("/api/contacts", contactRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server Listening on port ${port}...`));

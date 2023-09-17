import { Router } from "express";

import { login, signUp } from "../controllers/auth.js";

const authRoutes = Router();

authRoutes.post("/login", login);
authRoutes.post("/register", signUp);

export default authRoutes;

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const login = async (req, res) => {
  try {
    const { password } = req.body;
    const user_name = req.body.user_name.replace(/\s/g, "").toLowerCase();
    if (!user_name || !password) {
      return res
        .status(400)
        .json({ status: "failure", message: "Required field is missing" });
    }
    const user = await User.findOne(
      { user_name },
      { name: 1, user_name: 1, password: 1 }
    );
    if (!user) {
      return res
        .status(404)
        .json({ status: "failure", message: "User does not exist" });
    }
    const verifiedPassword = await bcrypt.compare(password, user.password);
    if (!verifiedPassword) {
      return res.status(400).json({
        status: "failure",
        message: "Incorrect user name or password",
      });
    }
    const token = await generateToken(user);
    delete user.password;
    res.status(200).json({
      status: "success",
      message: "Login successful",
      accesstoken: token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message || "Internal Server Error",
    });
  }
};

export const signUp = async (req, res) => {
  try {
    const { password, name } = req.body;
    const user_name = req.body.user_name.replace(/\s/g, "").toLowerCase();
    if (!user_name || !password) {
      return res
        .status(400)
        .json({ status: "failure", message: "Required field is missing" });
    }
    const oldUser = await User.findOne({
      user_name,
    });
    if (oldUser) {
      return res.status(400).json({
        status: "failure",
        message: "User account already exist",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      user_name,
      password: hashPassword,
    });
    const token = await generateToken(user);
    res.status(201).json({
      status: "success",
      message: "SignUp successful",
      accesstoken: token,
      user: {
        name: user.name,
        user_name: user.user_name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failure",
      message: err.message || "Internal Server Error",
    });
  }
};

const generateToken = async (user) => {
  try {
    const payload = { _id: user._id };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
      expiresIn: "30d",
    });

    return Promise.resolve(token);
  } catch (err) {
    return Promise.reject(err);
  }
};

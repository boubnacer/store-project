import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs");
  }

  const userExists = await User.findOne({ email });

  if (userExists) res.status(400).send({ message: "User already exists" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    return res.status(201).json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//authentication
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new Error("Please fill all the inputs");

  const existingUser = await User.findOne({ email });

  const userPwd = existingUser.password;

  if (existingUser) {
    const isPwdValid = await bcrypt.compare(password, userPwd);
    if (isPwdValid) {
      createToken(res, existingUser._id);
      res.status(201).json({
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
      return;
    } else {
      res.status(400);
      throw new Error("Incorrect email or password");
    }
  }
});

const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const userId = await req.user._id;
  const users = await User.find({});

  const isUserAdmin = await User.findOne({ _id: userId });
  if (!isUserAdmin)
    return res.status(401).json({ message: "Not authorized as admin" });

  res.status(200).json(users);
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById({ _id: req.user._id });

  if (user) {
    res
      .status(200)
      .json({ _id: user._id, username: user.username, email: user.email });
  } else {
    res.status(404);
    throw new Error("User does not found!");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById({ _id: req.user._id });

  const { username, email, password } = req.body;

  if (user) {
    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashpwd = await bcrypt.hash(password, salt);
      user.password = hashpwd;
    }

    const updatedUser = await user.save();

    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User deleted" });
  } else {
    res.status(404);
    throw new Error("User does not found");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User does not exist !");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const { username, email, password, isAdmin } = req.body;

  if (user) {
    user.username = username || user.username;
    user.email = email || user.email;
    user.isAdmin = Boolean(isAdmin) || user.isAdmin;
    if (password) {
      const salt = await bcrypt.getSalt(10);
      const hashPwd = await bcrypt.hash(password, salt);
      user.password = hashPwd;
    }
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

export {
  createUser,
  login,
  logout,
  getAllUsers,
  getProfile,
  updateUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};

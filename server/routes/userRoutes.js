import express from "express";
const router = express.Router();

import {
  createUser,
  getAllUsers,
  getProfile,
  login,
  logout,
} from "../controllers/userController.js";
import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizedAdmin, getAllUsers);

router.post("/auth", login);
router.post("/logout", logout);

router.post("/profile", getProfile);

export default router;

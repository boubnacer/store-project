import express from "express";
const router = express.Router();

import {
  createUser,
  deleteUserById,
  getAllUsers,
  getProfile,
  getUserById,
  login,
  logout,
  updateUserById,
  updateUserProfile,
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

router
  .route("/profile")
  .get(authenticate, getProfile)
  .put(authenticate, updateUserProfile);

// Admin routes
router
  .route("/:id")
  .delete(authenticate, authorizedAdmin, deleteUserById)
  .get(authenticate, authorizedAdmin, getUserById)
  .put(authenticate, authorizedAdmin, updateUserById);

export default router;

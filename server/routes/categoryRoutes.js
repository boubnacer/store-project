import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  readCategory,
  updateCategory,
} from "../controllers/categoryController.js";
const router = express.Router();

import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, authorizedAdmin, createCategory);

router
  .route("/:categoryId")
  .put(authenticate, authorizedAdmin, updateCategory)
  .delete(authenticate, authorizedAdmin, deleteCategory)
  .get(readCategory);

router.route("/categories").get(getCategories);

export default router;

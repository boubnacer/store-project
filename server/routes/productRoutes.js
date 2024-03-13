import express from "express";
import formidable from "express-formidable";
import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import {
  addProduct,
  addProductReview,
  deleteProduct,
  fetchNewProducts,
  fetchProducts,
  fetchTopProducts,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.route("/allproducts").get(getAllProducts);
router.route("/top").get(fetchTopProducts);
router.route("/new").get(fetchNewProducts);

router
  .route("/")
  .get(fetchProducts)
  .post(authenticate, authorizedAdmin, formidable(), addProduct);

router
  .route("/:id")
  .get(getSingleProduct)
  .put(authenticate, authorizedAdmin, formidable(), updateProduct)
  .delete(authenticate, authorizedAdmin, deleteProduct);

router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

export default router;

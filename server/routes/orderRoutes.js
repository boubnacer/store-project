import express from "express";
const router = express.Router();

import {
  countTotalOrders,
  countTotalSales,
  countTotalSalesByDate,
  createOrder,
  findOrderById,
  getAllOrders,
  getUserOrders,
  markOrderAsDelivered,
  markOrderAsPaid,
} from "../controllers/orderController.js";

import {
  authenticate,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizedAdmin, getAllOrders);

router.route("/my-orders").get(authenticate, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(countTotalSales);
router.route("/total-sales-by-date").get(countTotalSalesByDate);

router.route("/:id").get(authenticate, findOrderById);
router.route("/:id/pay").put(authenticate, markOrderAsPaid);

router.route("/:id/").put(authenticate, authorizedAdmin, markOrderAsDelivered);

export default router;

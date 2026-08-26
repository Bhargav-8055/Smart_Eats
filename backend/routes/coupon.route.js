import express from "express";
import { createCoupon, getCoupons, validateCoupon } from "../controllers/coupon.controller.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/all", isAuth, getCoupons);
router.post("/validate", isAuth, validateCoupon);
router.post("/create", createCoupon); // For internal use/seeding

export default router;

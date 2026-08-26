import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ isActive: true });
        res.status(200).json(coupons);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const validateCoupon = async (req, res) => {
    try {
        const { code, cartAmount } = req.body;
        const userId = req.userId; // Auth middleware adds userId to req

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid Coupon Code" });
        }

        if (cartAmount < coupon.minOrderAmount) {
            return res.status(400).json({ message: `Minimum order amount of ₹${coupon.minOrderAmount} required` });
        }

        if (coupon.isFirstOrderOnly) {
            const previousOrders = await Order.countDocuments({ user: userId });
            if (previousOrders > 0) {
                return res.status(400).json({ message: "This coupon is valid only for the first order" });
            }
        }

        let discount = 0;
        if (coupon.discountType === 'flat') {
            discount = coupon.discountAmount;
        } else if (coupon.discountType === 'percentage') {
            discount = (cartAmount * coupon.discountAmount) / 100;
        }

        // Ensure discount doesn't exceed cart amount
        discount = Math.min(discount, cartAmount);

        res.status(200).json({
            success: true,
            message: "Coupon Applied Successfully",
            discount: discount,
            code: coupon.code
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

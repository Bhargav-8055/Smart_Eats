import mongoose from "mongoose";
import dotenv from "dotenv";
import Coupon from "./models/coupon.model.js";

dotenv.config();

const seedCoupons = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connected");

        // Delete existing coupons to avoid duplicates
        await Coupon.deleteMany({});
        console.log("Cleared existing coupons");

        const coupons = [
            {
                code: "FIRST100",
                description: "₹100 off on your first order",
                discountType: "flat",
                discountAmount: 100,
                minOrderAmount: 200,
                isFirstOrderOnly: true,
                isActive: true
            },
            {
                code: "SAVE50",
                description: "₹50 off on orders above ₹300",
                discountType: "flat",
                discountAmount: 50,
                minOrderAmount: 300,
                isFirstOrderOnly: false,
                isActive: true
            },
            {
                code: "FLAT200",
                description: "₹200 off on orders above ₹1000",
                discountType: "flat",
                discountAmount: 200,
                minOrderAmount: 1000,
                isFirstOrderOnly: false,
                isActive: true
            },
            {
                code: "WEEKEND20",
                description: "20% off on all orders",
                discountType: "percentage",
                discountAmount: 20,
                minOrderAmount: 250,
                isFirstOrderOnly: false,
                isActive: true
            },
            {
                code: "FEAST500",
                description: "₹500 off on orders above ₹2000",
                discountType: "flat",
                discountAmount: 500,
                minOrderAmount: 2000,
                isFirstOrderOnly: false,
                isActive: true
            },
            {
                code: "TASTE15",
                description: "15% off on orders above ₹400",
                discountType: "percentage",
                discountAmount: 15,
                minOrderAmount: 400,
                isFirstOrderOnly: false,
                isActive: true
            }
        ];

        const createdCoupons = await Coupon.insertMany(coupons);
        console.log(`✅ Successfully created ${createdCoupons.length} coupons:`);
        createdCoupons.forEach(coupon => {
            console.log(`   - ${coupon.code}: ${coupon.description}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

seedCoupons();

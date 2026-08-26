import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./models/order.model.js";
import User from "./models/user.model.js";

dotenv.config();

const checkLatestOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connected");

        const order = await Order.findOne().sort({ createdAt: -1 });
        if (order) {
            console.log(`Latest Order ID: ${order._id}`);
            console.log(`Delivery Address:`, order.deliveryAddress);
            console.log(`Status:`, order.shopOrders[0].status);
            
            const user = await mongoose.model("User").findById(order.user);
            console.log(`User SocketID: ${user.socketId}`);
            console.log(`User IsOnline: ${user.isOnline}`);
        } else {
            console.log("No orders found.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkLatestOrder();

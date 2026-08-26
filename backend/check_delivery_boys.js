import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config();

const checkDeliveryBoys = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connected");

        const deliveryBoys = await User.find({ role: "deliveryBoy" });
        console.log(`Found ${deliveryBoys.length} delivery boys.`);

        deliveryBoys.forEach(boy => {
            console.log(`- ${boy.fullName} (${boy.email})`);
            console.log(`  Location:`, boy.location);
        });

        const assignments = await mongoose.connection.db.collection("deliveryassignments").find({}).toArray();
        console.log(`Found ${assignments.length} delivery assignments.`);
        assignments.forEach(a => {
            console.log(`- Assignment: ${a._id}, Status: ${a.status}, AssignedTo: ${a.assignedTo}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkDeliveryBoys();

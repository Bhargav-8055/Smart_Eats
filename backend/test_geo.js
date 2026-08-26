import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";

dotenv.config();

const testGeoQuery = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Connected");

        // Coordinates from the latest order (approx)
        const longitude = 78.4902392745098;
        const latitude = 17.39676954901961;

        console.log(`Searching near [${longitude}, ${latitude}]...`);

        const nearByDeliveryBoys = await User.find({
            role: "deliveryBoy",
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
                    $maxDistance: 5000
                }
            }
        });

        console.log(`Found ${nearByDeliveryBoys.length} delivery boys.`);
        nearByDeliveryBoys.forEach(boy => {
            console.log(`- ${boy.fullName}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

testGeoQuery();

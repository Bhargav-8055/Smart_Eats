import { consumeQueue } from "../config/rabbitmq.config.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
// You might need to import other mail functions if they exist, or create a generic one
// For now, assuming we use the existing mail utility structure

const processEmailJob = async (jobData, ack) => {
    try {
        const { type, payload } = jobData;
        console.log(`📧 Processing email job: ${type}`);

        switch (type) {
            case 'sendDeliveryOtp':
                await sendDeliveryOtpMail(payload.user, payload.otp);
                break;
            
            case 'sendOrderConfirmation':
                // Implement order confirmation email logic here
                // For now, just log it as we might not have the function ready
                console.log(`Sending order confirmation to ${payload.email}`);
                // await sendOrderConfirmationMail(payload); 
                break;

            default:
                console.warn(`Unknown email job type: ${type}`);
        }

        ack(); // Acknowledge message processing
        console.log(`✅ Email job completed: ${type}`);
    } catch (error) {
        console.error(`❌ Email job failed:`, error);
        // Negative acknowledgement (requeue if needed, or dead letter)
        // For now, we just log error. In production, you might want to retry.
    }
};

export const startEmailWorker = () => {
    consumeQueue('email_queue', processEmailJob);
};

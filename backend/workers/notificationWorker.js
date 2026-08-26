import { consumeQueue } from "../config/rabbitmq.config.js";

let ioInstance;

export const setIoInstance = (io) => {
    ioInstance = io;
};

const processNotificationJob = async (jobData, ack) => {
    try {
        const { type, payload } = jobData;
        console.log(`🔔 Processing notification job: ${type}`);

        if (!ioInstance) {
            console.error("Socket.io instance not initialized in worker");
            return;
        }

        switch (type) {
            case 'newOrder':
                // Notify restaurant owner
                if (payload.ownerSocketId) {
                    ioInstance.to(payload.ownerSocketId).emit('newOrder', payload.data);
                }
                break;

            case 'updateStatus':
                // Notify user
                if (payload.userSocketId) {
                    ioInstance.to(payload.userSocketId).emit('update-status', payload.data);
                }
                break;
            
            case 'deliveryBoyAssigned':
                 // Notify user and owner
                 if (payload.userSocketId) {
                    ioInstance.to(payload.userSocketId).emit('deliveryBoyAssigned', payload.data);
                 }
                 if (payload.ownerSocketId) {
                    ioInstance.to(payload.ownerSocketId).emit('deliveryBoyAssigned', payload.data);
                 }
                 break;

            case 'orderDelivered':
                 // Notify user
                 if (payload.userSocketId) {
                    ioInstance.to(payload.userSocketId).emit('order-delivered', payload.data);
                    ioInstance.to(payload.userSocketId).emit('update-status', {
                        ...payload.statusUpdateData,
                        status: 'delivered'
                    });
                 }
                 // Notify owner
                 if (payload.ownerSocketId) {
                    ioInstance.to(payload.ownerSocketId).emit('update-status', {
                        ...payload.statusUpdateData,
                        status: 'delivered'
                    });
                 }
                 break;

            default:
                console.warn(`Unknown notification job type: ${type}`);
        }

        ack();
        console.log(`✅ Notification job completed: ${type}`);
    } catch (error) {
        console.error(`❌ Notification job failed:`, error);
    }
};

export const startNotificationWorker = (io) => {
    setIoInstance(io);
    consumeQueue('notification_queue', processNotificationJob);
};

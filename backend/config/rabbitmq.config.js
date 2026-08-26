import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let connection = null;
let channel = null;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const connectRabbitMQ = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            const amqpServer = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
            connection = await amqp.connect(amqpServer);
            channel = await connection.createChannel();

            // Assert queues to ensure they exist
            await channel.assertQueue('email_queue', { durable: true });
            await channel.assertQueue('notification_queue', { durable: true });

            console.log('✅ RabbitMQ connected successfully');

            // Handle connection close
            connection.on('close', () => {
                console.error('RabbitMQ connection closed, retrying...');
                setTimeout(connectRabbitMQ, 5000);
            });

            return channel;
        } catch (error) {
            console.error(`Failed to connect to RabbitMQ (retries left: ${retries}):`, error.message);
            retries -= 1;
            await wait(5000);
        }
    }
    console.error('❌ Could not connect to RabbitMQ after multiple retries');
};

export const getChannel = () => channel;

export const publishToQueue = async (queueName, data) => {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }
        if (channel) {
            channel.sendToQueue(
                queueName,
                Buffer.from(JSON.stringify(data)),
                { persistent: true }
            );
            console.log(`📨 Message sent to ${queueName}`);
        } else {
            console.error(`Cannot publish to ${queueName}: RabbitMQ channel not available`);
        }
    } catch (error) {
        console.error(`Error publishing to ${queueName}:`, error);
    }
};

export const consumeQueue = async (queueName, callback) => {
    try {
        if (!channel) {
            await connectRabbitMQ();
        }
        if (channel) {
            await channel.consume(queueName, (data) => {
                if (data) {
                    const content = JSON.parse(data.content.toString());
                    callback(content, () => channel.ack(data));
                }
            });
            console.log(`👂 Listening to ${queueName}`);
        } else {
            console.error(`Cannot consume ${queueName}: RabbitMQ channel not available`);
        }
    } catch (error) {
        console.error(`Error consuming ${queueName}:`, error);
    }
};

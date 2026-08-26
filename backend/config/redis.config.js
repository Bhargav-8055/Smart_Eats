import { createClient } from 'redis';

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
    }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('✅ Redis connected successfully'));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
};

// Utility functions
export const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis Get Error:', error);
        return null;
    }
};

export const setCache = async (key, value, ttl = 300) => { // Default TTL 5 mins
    try {
        await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
        console.error('Redis Set Error:', error);
    }
};

export const delCache = async (key) => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error('Redis Del Error:', error);
    }
};

export const clearCachePattern = async (pattern) => {
    try {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`🗑️ Cache cleared for pattern: ${pattern}`);
        }
    } catch (error) {
        console.error('Redis Clear Pattern Error:', error);
    }
};

export default redisClient;

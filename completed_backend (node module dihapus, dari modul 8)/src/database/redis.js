const { createClient } = require('redis');

// no 1
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err.message);
});

redisClient.on('ready', () => {
  console.log('Connected to Redis');
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
// akhir no 1

function getUserCacheKey(email) {
  return `user:${String(email).toLowerCase()}`;
}

// no 2
async function getCachedUserByEmail(email) {
  if (!redisClient.isOpen) return null;
  const cached = await redisClient.get(getUserCacheKey(email));
  return cached ? JSON.parse(cached) : null;
}

async function setCachedUserByEmail(email, userData, ttlSeconds = 60) {
  if (!redisClient.isOpen) return;
  await redisClient.set(
    getUserCacheKey(email),
    JSON.stringify(userData),
    { EX: ttlSeconds }
  );
}
// akhir no 2

// no 3
async function deleteCachedUserByEmail(email) {
  if (!redisClient.isOpen || !email) return;
  await redisClient.del(getUserCacheKey(email));
}
// akhir no 3

// no 4
async function appendTransactionLog({ userId, itemId, total }) {
  if (!redisClient.isOpen) return null;

  return redisClient.xAdd('transaction-logs', '*', {
    userId: String(userId),
    itemId: String(itemId),
    total: String(total),
  });
}
// akhir no 4

module.exports = {
  redisClient,
  connectRedis,
  getCachedUserByEmail,
  setCachedUserByEmail,
  deleteCachedUserByEmail,
  appendTransactionLog,
};
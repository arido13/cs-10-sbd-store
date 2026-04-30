require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/database');
const { connectRedis } = require('./src/database/redis');

const PORT = process.env.PORT || 3000;

db.query('SELECT NOW()')
  .then(async () => {
    console.log('Database connected successfully');

    try {
      await connectRedis();
    } catch (redisError) {
      console.warn('Redis connection skipped:', redisError.message);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
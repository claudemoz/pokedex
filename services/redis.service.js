const Redis = require('ioredis');

let client = null;
let isConnected = false;

exports.connect = () => {
  if (isConnected) {
    return client;
  }

  try {
    client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3
    });

    client.on('connect', () => {
      console.log('✅ Redis connected successfully'.green);
      isConnected = true;
    });

    client.on('error', (err) => {
      console.error('❌ Redis connection error:'.red, err.message);
      isConnected = false;
    });

    client.on('close', () => {
      console.log('⚠️  Redis connection closed'.yellow);
      isConnected = false;
    });

    return client;
  } catch (error) {
    console.error('❌ Failed to initialize Redis:'.red, error.message);
    throw error;
  }
};

exports.get = async (key) => {
  try {
    if (!isConnected) {
      console.warn('⚠️  Redis not connected, skipping cache get'.yellow);
      return null;
    }
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ Redis GET error:'.red, error.message);
    return null;
  }
};

exports.set = async (key, value, ttl = null) => {
  try {
    if (!isConnected) {
      console.warn('⚠️  Redis not connected, skipping cache set'.yellow);
      return false;
    }
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await client.setex(key, ttl, stringValue);
    } else {
      await client.set(key, stringValue);
    }
    return true;
  } catch (error) {
    console.error('❌ Redis SET error:'.red, error.message);
    return false;
  }
};

exports.del = async (key) => {
  try {
    if (!isConnected) {
      console.warn('⚠️  Redis not connected, skipping cache delete'.yellow);
      return false;
    }
    await client.del(key);
    return true;
  } catch (error) {
    console.error('❌ Redis DEL error:'.red, error.message);
    return false;
  }
};

exports.flushAll = async () => {
  try {
    if (!isConnected) {
      console.warn('⚠️  Redis not connected, skipping flush'.yellow);
      return false;
    }
    await client.flushall();
    return true;
  } catch (error) {
    console.error('❌ Redis FLUSH error:'.red, error.message);
    return false;
  }
};

exports.disconnect = async () => {
  try {
    if (client) {
      await client.quit();
      isConnected = false;
      console.log('✅ Redis disconnected'.green);
    }
  } catch (error) {
    console.error('❌ Redis disconnect error:'.red, error.message);
  }
};

exports.getClient = () => {
  return client;
};

exports.isConnected = () => {
  return isConnected;
};

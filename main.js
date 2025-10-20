require("module-alias/register");
require('colors');
const http = require('http');
const app = require('@app');
const redisService = require('@services/redis.service');
const server = http.createServer(app);

// Initialize Redis connection
redisService.connect();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await redisService.disconnect();
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await redisService.disconnect();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

if (process.env.NODE_ENV === 'development') {
  console.log('process.env.NODE_ENV ', process.env.NODE_ENV);
  server.listen(process.env.PORT || 9000, () => {
    console.log(
      `Server listening on port ${process.env.PORT || 9000}...  http://localhost:${process.env.PORT || 9000}`.blue
    );
  });
} else {
  server.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}...`.green);
  });
}

require("module-alias/register");
require('colors');
const http = require('http');
const app = require('@app');
const redisService = require('@services/redis.service');
const server = http.createServer(app);

// Initialiser la connexion Redis
redisService.connect();

// Arrêt gracieux
process.on('SIGTERM', async () => {
  console.log('Signal SIGTERM reçu : fermeture du serveur HTTP');
  await redisService.disconnect();
  server.close(() => {
    console.log('Serveur HTTP fermé');
  });
});

process.on('SIGINT', async () => {
  console.log('Signal SIGINT reçu : fermeture du serveur HTTP');
  await redisService.disconnect();
  server.close(() => {
    console.log('Serveur HTTP fermé');
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

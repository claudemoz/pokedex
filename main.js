require("module-alias/register");
const app = require('@app');
const server = http.createServer(app);

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

const app = require("./app");
const env = require("dotenv");
const { path } = require("./app");

const connectDatabase = require("./config/database");

//Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log("Shutting down server due uncaught exception");

  process.exit(1);
});

//config
env.config({ path: "backend/config/config.env" });

//connect to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http//:localhost:${process.env.PORT}`);
});

//unhandled Promise Rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");

  server.close(() => {
    process.exit(1);
  });
});

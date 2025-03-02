const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const logger = require("./config/logger");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const verifyJWT = require("../src/middleware/verifyJWT");
const userRoutes = require("./resources/users/routes");
const ticketRoutes = require("./resources/ticket/routes");

const app = express();

// Middlewares

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);
app.use(cors(corsOptions));

//built in middleware to handle urlencoded data
// in other words, form data:
// 'Content-Type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

//built in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// check route
app.get("/", (req, res) => {
  logger.info("Root route accessed");
  res.send({ message: "Hello, world!" });
});

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tickets", verifyJWT, ticketRoutes);
// app.use("/api/v1/tickets", ticketRoutes);

// default(404)
app.all("*", (req, res) => {
  logger.info("404 Not Found!");
  res.status(404).json({ error: "404 Not Found!" });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(500).json({ error: err.message });
});

module.exports = app;

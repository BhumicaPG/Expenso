const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Router = require("./routers");
const path = require("path");

// Load environment variables from .env file in the root directory
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const dbURI = process.env.DATABASE;

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(Router);

// Serve static React files (always, not just in "production" for Render)
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Database connection
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Connected to MongoDB and listening at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Error handling middleware (example)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Serve static files and handle client-side routing in production

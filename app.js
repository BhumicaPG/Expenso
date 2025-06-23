const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Router = require("./routers");
const path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const dbURI = process.env.DATABASE;

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(Router);

// Connect to DB and then serve frontend + start server
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Serve static frontend only after successful DB connection
    app.use(express.static(path.join(__dirname, "client", "build")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });

    app.listen(port, () => {
      console.log(`Connected to MongoDB and listening at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

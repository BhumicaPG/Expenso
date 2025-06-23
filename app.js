const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Router = require("./routers");
const path = require("path");

// Keep this at the top
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const dbURI = process.env.DATABASE;

// Middlewares
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(Router);

// Serve static React files always
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Start server FIRST
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});

// Connect to DB separately (doesn’t block server startup)
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

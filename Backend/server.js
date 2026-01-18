import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import providerRoutes from "./routes/provider.js";
import adminRoutes from "./routes/admin.js";
import serviceRoutes from "./routes/service.js";
import paymentRoutes from "./routes/payment.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ServeSync API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log("");
    console.log("═════════════════════════════════════════");
    console.log("  🚀 ServeSync Backend Server Started");
    console.log("═════════════════════════════════════════");
    console.log(`  📡 Server running on: http://localhost:${PORT}`);
    console.log(`  🗄️  Database: ${process.env.MONGODB_URI}`);
    console.log(`  🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log("═════════════════════════════════════════");
    console.log("");
    console.log("  Available endpoints:");
    console.log("  • GET  /api/health");
    console.log("  • POST /api/auth/register");
    console.log("  • POST /api/auth/login/user");
    console.log("  • POST /api/auth/login/provider");
    console.log("  • POST /api/auth/login/admin");
    console.log("  • GET  /api/user/test");
    console.log("  • GET  /api/provider/test");
    console.log("  • GET  /api/admin/test");
    console.log("  • GET  /api/service/");
    console.log("");
  });
};

// Handle shutdown
process.on("SIGINT", async () => {
  console.log("\n⚠️  Shutting down gracefully...");
  await mongoose.connection.close();
  console.log("✅ Database connection closed");
  process.exit(0);
});

startServer();

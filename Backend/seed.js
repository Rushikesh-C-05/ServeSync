import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "choudharirushikeshm@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      email: "choudharirushikeshm@gmail.com",
      password: "Rushi123", // This will be hashed by the pre-save hook
      name: "Rushi Admin",
      phone: "1234567890",
      address: "Admin Office",
      role: "admin",
      isBlocked: false,
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: choudharirushikeshm@gmail.com");
    console.log("Password: Rushi123");

    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin user:", error);
    process.exit(1);
  }
};

seedAdmin();

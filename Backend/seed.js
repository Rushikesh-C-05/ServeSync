import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import PlatformConfig from "./models/PlatformConfig.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing users (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // console.log('🗑️  Cleared existing users');

    // Create test users if they don't exist
    const testUsers = [
      {
        email: "user@servesync.com",
        password: "password123",
        name: "Test User",
        phone: "+1234567890",
        address: "123 Main St, City",
        role: "user",
      },
      {
        email: "provider@servesync.com",
        password: "password123",
        name: "Test Provider",
        phone: "+1234567891",
        address: "456 Provider Ave, City",
        role: "provider",
      },
      {
        email: "admin@servesync.com",
        password: "password123",
        name: "Admin User",
        phone: "+1234567892",
        address: "789 Admin Blvd, City",
        role: "admin",
      },
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
    }

    // Create platform config if it doesn't exist
    let config = await PlatformConfig.findOne();
    if (!config) {
      config = new PlatformConfig({ feePercentage: 10 });
      await config.save();
      console.log("✅ Created platform config");
    } else {
      console.log("⚠️  Platform config already exists");
    }

    console.log("");
    console.log("✅ Database seeding completed!");
    console.log("");
    console.log("Test accounts:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  User:     user@servesync.com / password123");
    console.log("  Provider: provider@servesync.com / password123");
    console.log("  Admin:    admin@servesync.com / password123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();

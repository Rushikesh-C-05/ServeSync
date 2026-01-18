import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  phone: String,
  role: String,
  isBlocked: Boolean,
  createdAt: Date,
  updatedAt: Date,
});

const User = mongoose.model("User", userSchema);

const reseedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Hash the password properly
    const hashedPassword = await bcrypt.hash("password123", 10);
    console.log("✅ Password hashed");

    // Delete old users
    await User.deleteMany({
      email: {
        $in: [
          "user@servesync.com",
          "provider@servesync.com",
          "admin@servesync.com",
        ],
      },
    });
    console.log("✅ Deleted old users");

    // Create new users with correct hash
    const users = [
      {
        email: "user@servesync.com",
        password: hashedPassword,
        name: "Test User",
        phone: "1234567890",
        role: "user",
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "provider@servesync.com",
        password: hashedPassword,
        name: "Test Provider",
        phone: "0987654321",
        role: "provider",
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin@servesync.com",
        password: hashedPassword,
        name: "Admin User",
        phone: "5555555555",
        role: "admin",
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await User.insertMany(users);
    console.log("✅ Created new users with correct password hashes");

    console.log("\n🎉 Re-seeding complete!");
    console.log("\nTest accounts (all with password: password123):");
    console.log("• User:     user@servesync.com");
    console.log("• Provider: provider@servesync.com");
    console.log("• Admin:    admin@servesync.com");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

reseedUsers();

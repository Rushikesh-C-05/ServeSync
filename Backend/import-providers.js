import mongoose from "mongoose";
import User from "./models/User.js";
import Provider from "./models/Provider.js";
import Service from "./models/Service.js";
import PlatformConfig from "./models/PlatformConfig.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/servesync";

const importProviderData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Import Platform Config
    console.log("\n📋 Importing Platform Config...");
    const platformConfigData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "seed-data/platformconfig.json"),
        "utf-8",
      ),
    );

    // Check if config already exists
    const existingConfig = await PlatformConfig.findOne();
    if (existingConfig) {
      console.log("⚠️  Platform config already exists, updating categories...");
      existingConfig.categories = platformConfigData[0].categories;
      existingConfig.updatedAt = Date.now();
      await existingConfig.save();
    } else {
      await PlatformConfig.insertMany(platformConfigData);
    }
    console.log("✅ Platform config imported");

    // Import Provider Users
    console.log("\n👥 Importing Provider Users...");
    const usersData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "seed-data/provider-users.json"),
        "utf-8",
      ),
    );

    const insertedUsers = [];
    for (const userData of usersData) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⏭️  User ${userData.email} already exists, skipping...`);
        insertedUsers.push(existingUser);
      } else {
        const newUser = new User(userData);
        await newUser.save();
        insertedUsers.push(newUser);
        console.log(`✅ Created user: ${userData.email}`);
      }
    }
    console.log(`✅ ${insertedUsers.length} provider users processed`);

    // Import Providers with correct user IDs
    console.log("\n🏢 Importing Providers...");
    const providersData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "seed-data/providers.json"),
        "utf-8",
      ),
    );

    let importedCount = 0;
    for (let i = 0; i < providersData.length && i < insertedUsers.length; i++) {
      const providerData = providersData[i];
      const userId = insertedUsers[i]._id;

      // Check if provider already exists
      const existingProvider = await Provider.findOne({ userId });
      if (existingProvider) {
        console.log(
          `⏭️  Provider for user ${insertedUsers[i].email} already exists, skipping...`,
        );
      } else {
        const newProvider = new Provider({
          ...providerData,
          userId,
        });
        await newProvider.save();
        console.log(`✅ Created provider: ${providerData.businessName}`);
        importedCount++;
      }
    }
    console.log(`✅ ${importedCount} new providers imported`);

    // Import Services with correct provider IDs
    console.log("\n🛠️  Importing Services...");
    const servicesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "seed-data/services.json"), "utf-8"),
    );

    // Get all providers to map services
    const allProviders = await Provider.find().populate("userId");
    const providerMap = {};
    allProviders.forEach((provider, index) => {
      providerMap[`REPLACE_WITH_PROVIDER_ID_${index + 1}`] = provider._id;
    });

    let servicesImported = 0;
    for (const serviceData of servicesData) {
      const providerId = providerMap[serviceData.providerId];

      if (!providerId) {
        console.log(
          `⚠️  No provider found for ${serviceData.name}, skipping...`,
        );
        continue;
      }

      // Check if service already exists
      const existingService = await Service.findOne({
        name: serviceData.name,
        providerId,
      });

      if (existingService) {
        console.log(
          `⏭️  Service "${serviceData.name}" already exists, skipping...`,
        );
      } else {
        const newService = new Service({
          ...serviceData,
          providerId,
        });
        await newService.save();
        console.log(`✅ Created service: ${serviceData.name}`);
        servicesImported++;
      }
    }
    console.log(`✅ ${servicesImported} new services imported`);

    console.log("\n✨ Import completed successfully!\n");
    console.log("Summary:");
    console.log(
      `- Platform Config: ${(await PlatformConfig.findOne()).categories.length} categories`,
    );
    console.log(
      `- Total Provider Users: ${await User.countDocuments({ role: "provider" })}`,
    );
    console.log(`- Total Providers: ${await Provider.countDocuments()}`);
    console.log(
      `- Approved Providers: ${await Provider.countDocuments({ status: "approved" })}`,
    );
    console.log(
      `- Pending Providers: ${await Provider.countDocuments({ status: "pending" })}`,
    );
    console.log(`- Total Services: ${await Service.countDocuments()}`);
    console.log(
      `- Available Services: ${await Service.countDocuments({ isAvailable: true })}`,
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Import error:", error);
    process.exit(1);
  }
};

importProviderData();

# MongoDB Import Guide

## Import Instructions

### Using MongoDB Compass:

1. Open MongoDB Compass and connect to your database
2. Navigate to each collection and use the "Import Data" feature
3. Select the corresponding JSON file

### Using mongoimport command:

```bash
# Import Platform Config (categories)
mongoimport --db servesync --collection platformconfigs --file seed-data/platformconfig.json --jsonArray

# Import Provider Users
# Note: After importing, you'll need to get the user IDs and update the providers.json file
mongoimport --db servesync --collection users --file seed-data/provider-users.json --jsonArray

# Import Providers (after updating userId references)
mongoimport --db servesync --collection providers --file seed-data/providers.json --jsonArray

# Import Services (after updating providerId references)
mongoimport --db servesync --collection services --file seed-data/services.json --jsonArray
```

## Important Notes:

### 1. Password Hash

All provider users have the password: **password123**

The hash in the JSON files is a placeholder. For actual imports, you should either:

- Use the existing seed.js script to properly hash passwords
- Or manually update the password field after import

### 2. Provider User IDs

The `providers.json` file contains placeholders like `REPLACE_WITH_USER_ID_1`.

**Steps to fix this:**

1. Import `provider-users.json` first
2. Get the actual `_id` values from the users collection
3. Replace the placeholders in `providers.json` with actual user IDs
4. Then import `providers.json`

**OR** use the script below to automate this:

### 3. Automated Import Script

Create a file `import-providers.js`:

```javascript
import mongoose from "mongoose";
import User from "./models/User.js";
import Provider from "./models/Provider.js";
import PlatformConfig from "./models/PlatformConfig.js";
import fs from "fs";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/servesync";

const importData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data (optional)
    // await User.deleteMany({ role: 'provider' });
    // await Provider.deleteMany({});
    // await PlatformConfig.deleteMany({});

    // Import Platform Config
    const platformConfigData = JSON.parse(
      fs.readFileSync("./seed-data/platformconfig.json", "utf-8"),
    );
    await PlatformConfig.insertMany(platformConfigData);
    console.log("Platform config imported");

    // Import Users
    const usersData = JSON.parse(
      fs.readFileSync("./seed-data/provider-users.json", "utf-8"),
    );
    const insertedUsers = await User.insertMany(usersData);
    console.log(`${insertedUsers.length} provider users imported`);

    // Import Providers with correct user IDs
    const providersData = JSON.parse(
      fs.readFileSync("./seed-data/providers.json", "utf-8"),
    );

    const providersWithUserIds = providersData.map((provider, index) => {
      if (index < insertedUsers.length) {
        return {
          ...provider,
          userId: insertedUsers[index]._id,
        };
      }
      return provider;
    });

    await Provider.insertMany(providersWithUserIds);
    console.log(`${providersWithUserIds.length} providers imported`);

    console.log("Import completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Import error:", error);
    process.exit(1);
  }
};

importData();
```

Run with: `node import-providers.js`

## Data Summary

- **Platform Config**: 1 document with 20 service categories
- **Provider Users**: 10 approved + 2 pending providers
- **Provider Profiles**: 12 providers (10 approved, 2 pending)
- **Services**: 30 services across 10 categories
- **Categories included**:
  - Plumbing, Electrical, Cleaning, Carpentry, Painting
  - Home Repair, Landscaping, Moving, Pest Control, HVAC
  - Appliance Repair, Roofing, Flooring, Interior Design
  - Photography, Catering, Pet Care, Tutoring, Fitness Training, Other

- **Provider Status**: 10 approved, 2 pending (for testing approval workflow)
- **Service Details**:
  - Prices range from $80 to $3,500
  - Duration from 60 to 1440 minutes
  - All services have ratings and booking counts
  - Multiple services per provider for variety

# Database Relationships - ServeSync

## Entity Relationship Diagram

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ _id (ObjectId)  │◄──────────┐
│ email           │           │
│ password        │           │
│ name            │           │
│ phone           │           │
│ address         │           │
│ role            │           │ (One-to-One)
│ isBlocked       │           │
└─────────────────┘           │
                              │
                              │ userId (FK)
                              │
                    ┌─────────────────┐
                    │   PROVIDERS     │
                    ├─────────────────┤
                    │ _id (ObjectId)  │◄──────────┐
                    │ userId          │           │
                    │ businessName    │           │
                    │ description     │           │
                    │ category        │           │ (One-to-Many)
                    │ experience      │           │
                    │ certifications  │           │
                    │ status          │           │ providerId (FK)
                    │ rating          │           │
                    └─────────────────┘           │
                                                  │
                                        ┌─────────────────┐
                                        │    SERVICES     │
                                        ├─────────────────┤
                                        │ _id (ObjectId)  │
                                        │ providerId      │
                                        │ name            │
                                        │ description     │
                                        │ category        │
                                        │ price           │
                                        │ duration        │
                                        │ isAvailable     │
                                        │ rating          │
                                        │ totalBookings   │
                                        └─────────────────┘
```

## Relationship Flow

### 1️⃣ User → Provider (One-to-One)
```javascript
// User document
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  email: "john.plumber@servesync.com",
  name: "John Smith",
  role: "provider"  // User has provider role
}

// Provider document (linked to user)
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"),  // ← References User._id
  businessName: "Smith Plumbing Services",
  category: "Plumbing",
  status: "approved"
}
```

### 2️⃣ Provider → Services (One-to-Many)
```javascript
// Provider document
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  businessName: "Smith Plumbing Services"
}

// Service documents (multiple services per provider)
{
  _id: ObjectId("507f1f77bcf86cd799439013"),
  providerId: ObjectId("507f1f77bcf86cd799439012"),  // ← References Provider._id
  name: "Emergency Plumbing Repair",
  price: 150
}

{
  _id: ObjectId("507f1f77bcf86cd799439014"),
  providerId: ObjectId("507f1f77bcf86cd799439012"),  // ← Same provider
  name: "Bathroom Fixture Installation",
  price: 200
}
```

## Complete Link Chain

```
User Account
    ↓ (userId)
Provider Profile
    ↓ (providerId)
Multiple Services
```

## Import Process Flow

### Step 1: Import Users
```bash
# Creates user accounts with emails and passwords
Users Collection: 10 documents created
Each gets a unique _id (MongoDB ObjectId)
```

### Step 2: Import Providers (Linked to Users)
```javascript
// The import script does this:
const users = await User.find({ role: "provider" });

providers.forEach((provider, index) => {
  provider.userId = users[index]._id;  // Link to user
  // Save provider with correct userId reference
});
```

### Step 3: Import Services (Linked to Providers)
```javascript
// The import script does this:
const providers = await Provider.find();

services.forEach((service, index) => {
  const providerIndex = Math.floor(index / 3);  // 3 services per provider
  service.providerId = providers[providerIndex]._id;  // Link to provider
  // Save service with correct providerId reference
});
```

## Query Examples

### Get all services for a specific provider:
```javascript
// Option 1: Direct query
const services = await Service.find({ providerId: provider._id });

// Option 2: With provider details
const services = await Service.find({ providerId: provider._id })
  .populate('providerId');
```

### Get provider details including user info:
```javascript
const provider = await Provider.findById(providerId)
  .populate('userId');  // Gets user data (name, email, etc.)
```

### Get complete chain (User → Provider → Services):
```javascript
const provider = await Provider.findOne({ userId: user._id })
  .populate('userId');

const services = await Service.find({ providerId: provider._id });

// Now you have:
// - provider.userId.name (user name)
// - provider.businessName (business name)
// - services[] (all services offered)
```

## Current Data Structure

### 10 Provider Users:
- Each has a User document (credentials, personal info)
- Each has a Provider document (business info)
- Each provider has 3 services

### Example: Provider #1 (John Smith)
```
User Document:
  _id: "user_id_1"
  email: "john.plumber@servesync.com"
  name: "John Smith"
  role: "provider"
  ↓
Provider Document:
  _id: "provider_id_1"
  userId: "user_id_1"  ← Links to user
  businessName: "Smith Plumbing Services"
  category: "Plumbing"
  ↓
Service Documents:
  1. _id: "service_id_1"
     providerId: "provider_id_1"  ← Links to provider
     name: "Emergency Plumbing Repair"
     
  2. _id: "service_id_2"
     providerId: "provider_id_1"  ← Same provider
     name: "Bathroom Fixture Installation"
     
  3. _id: "service_id_3"
     providerId: "provider_id_1"  ← Same provider
     name: "Water Heater Repair & Installation"
```

## MongoDB References

All relationships use **MongoDB ObjectId** references:
- `userId` in Provider → References `_id` in User
- `providerId` in Service → References `_id` in Provider

This is a **normalized database design** where:
- ✅ No data duplication
- ✅ Easy to update user/provider info (changes in one place)
- ✅ Services automatically get updated provider info via populate()
- ✅ Can query bidirectionally (user→services or service→user)

## Mongoose Population

In your code, you can easily traverse relationships:

```javascript
// Get a service with full provider and user details
const service = await Service.findById(serviceId)
  .populate({
    path: 'providerId',
    populate: {
      path: 'userId'
    }
  });

// Now you have:
service.name                        // "Emergency Plumbing Repair"
service.providerId.businessName     // "Smith Plumbing Services"
service.providerId.userId.name      // "John Smith"
service.providerId.userId.email     // "john.plumber@servesync.com"
```

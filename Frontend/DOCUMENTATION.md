# ServeSync Frontend - Complete Documentation

## 📑 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Routing & Navigation](#routing--navigation)
- [Components](#components)
- [Pages & Features](#pages--features)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [Styling & UI](#styling--ui)
- [Image Upload](#image-upload)
- [Best Practices](#best-practices)

---

## 🎯 Overview

ServeSync Frontend is a modern, responsive web application built with React and Vite. It provides a seamless user interface for the service marketplace platform with separate dashboards for Users, Providers, and Admins.

### Key Features

- ✅ Role-based authentication and routing
- ✅ Responsive design with Tailwind CSS
- ✅ Real-time notifications with React Hot Toast
- ✅ Image upload with preview functionality
- ✅ Protected routes and authorization checks
- ✅ Service browsing with search and filters
- ✅ Complete booking workflow
- ✅ Review and rating system
- ✅ Provider application system
- ✅ Admin dashboard for platform management
- ✅ Provider dashboard for service management
- ✅ Smooth animations with Framer Motion

---

## 🛠 Tech Stack

| Technology       | Version | Purpose                 |
| ---------------- | ------- | ----------------------- |
| React            | ^19.2.0 | UI library              |
| Vite             | ^7.2.4  | Build tool & dev server |
| React Router DOM | ^6.22.0 | Routing                 |
| Axios            | ^1.6.7  | HTTP client             |
| Tailwind CSS     | ^3.4.1  | Styling framework       |
| React Icons      | ^5.0.1  | Icon library            |
| React Hot Toast  | ^2.6.0  | Notifications           |

---

## 📁 Project Structure

```
Frontend/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, fonts, etc.
│   ├── components/           # Reusable components
│   │   ├── AdminLayout.jsx       # Admin panel layout
│   │   ├── AdminSidebar.jsx      # Admin sidebar navigation
│   │   ├── ConfirmDialog.jsx     # Confirmation modal
│   │   ├── ImageUpload.jsx       # Image upload component
│   │   ├── Navbar.jsx            # Main navigation bar
│   │   ├── ProtectedRoute.jsx    # Route protection HOC
│   │   ├── ReviewCard.jsx        # Review display card
│   │   ├── ServiceCard.jsx       # Service listing card
│   │   ├── ServiceReviews.jsx    # Reviews section
│   │   ├── StatCard.jsx          # Statistics card
│   │   └── StatusBadge.jsx       # Status indicator
│   ├── context/              # React Context
│   │   └── AuthContext.jsx       # Authentication state
│   ├── pages/                # Page components
│   │   ├── admin/               # Admin pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ManageApplications.jsx
│   │   │   ├── ManageBookings.jsx
│   │   │   ├── ManageCategories.jsx
│   │   │   ├── ManageProviders.jsx
│   │   │   ├── ManageReviews.jsx
│   │   │   ├── ManageServices.jsx
│   │   │   └── ManageUsers.jsx
│   │   ├── auth/                # Authentication pages
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── ProviderLogin.jsx
│   │   │   ├── ProviderRegister.jsx
│   │   │   ├── UserLogin.jsx
│   │   │   └── UserRegister.jsx
│   │   ├── provider/            # Provider pages
│   │   │   ├── BookingRequests.jsx
│   │   │   ├── Earnings.jsx
│   │   │   ├── ManageServices.jsx
│   │   │   ├── ProviderDashboard.jsx
│   │   │   └── Reviews.jsx
│   │   ├── public/              # Public pages
│   │   │   └── Landing.jsx
│   │   └── user/                # User pages
│   │       ├── BecomeProvider.jsx
│   │       ├── BookingDetails.jsx
│   │       ├── BrowseServices.jsx
│   │       ├── MyBookings.jsx
│   │       ├── UserDashboard.jsx
│   │       └── WriteReview.jsx
│   ├── services/             # API services
│   │   └── api.js               # API client & endpoints
│   ├── theme/                # Theme configuration
│   │   └── index.js
│   ├── utils/                # Utility functions
│   │   └── testConnection.js
│   ├── App.jsx               # Main app component
│   ├── index.css             # Global styles
│   └── main.jsx              # App entry point
├── .env                      # Environment variables
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML template
├── package.json              # Dependencies
├── postcss.config.js         # PostCSS config
├── tailwind.config.js        # Tailwind config
└── vite.config.js            # Vite configuration
```

---

## 🚀 Installation & Setup

### Prerequisites

1. **Node.js** (v14 or higher)

   ```bash
   node --version
   ```

2. **Backend API** running on `http://localhost:8080`

### Installation Steps

1. **Install dependencies:**

   ```bash
   cd Frontend
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   # Create .env file
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

   App will be available at `http://localhost:5173`

4. **Build for production:**

   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## ⚙️ Environment Configuration

### Environment Variables

| Variable            | Description          | Default                     |
| ------------------- | -------------------- | --------------------------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api` |

### Accessing Environment Variables

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## 🗺️ Routing & Navigation

### Route Structure

**File:** `src/App.jsx`

#### Public Routes

```javascript
/                          → Landing page
/login                     → User login (redirects to /login/user)
/login/user               → User login
/login/provider           → Provider login
/login/admin              → Admin login
/register                  → User registration
/register/provider        → Provider registration
```

#### Protected User Routes

```javascript
/user/dashboard           → User dashboard
/user/bookings            → My bookings
/user/bookings/:id        → Booking details
/user/browse-services     → Browse services
/user/become-provider     → Provider application
/user/write-review/:id    → Write review
```

#### Protected Provider Routes

```javascript
/provider/dashboard       → Provider dashboard
/provider/services        → Manage services
/provider/bookings        → Booking requests
/provider/earnings        → Earnings & analytics
/provider/reviews         → Reviews & ratings
```

#### Protected Admin Routes

```javascript
/admin/dashboard          → Admin dashboard
/admin/users              → Manage users
/admin/providers          → Manage providers
/admin/applications       → Provider applications
/admin/services           → Manage services
/admin/bookings           → Manage bookings
/admin/reviews            → Manage reviews
/admin/categories         → Manage categories
```

### Route Protection

**Component:** `components/ProtectedRoute.jsx`

```javascript
<ProtectedRoute allowedRoles={["user", "provider"]}>
  <UserDashboard />
</ProtectedRoute>
```

Features:

- Checks authentication status
- Validates user role
- Redirects unauthorized users
- Preserves attempted URL for post-login redirect

---

## 🧩 Components

### Core Components

#### 1. **Navbar** (`components/Navbar.jsx`)

Main navigation component with role-based links.

**Props:**

```javascript
{
  role: 'user' | 'provider' | 'admin',
  links: Array<{ to: string, label: string, icon: Component }>
}
```

**Features:**

- Mobile responsive menu
- User profile dropdown
- Profile image display
- Logout functionality

**Usage:**

```javascript
const userLinks = [
  { to: "/user/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/user/browse-services", label: "Browse", icon: FiSearch },
  { to: "/user/bookings", label: "My Bookings", icon: FiCalendar },
];

<Navbar role="user" links={userLinks} />;
```

#### 2. **ImageUpload** (`components/ImageUpload.jsx`)

Reusable image upload component with preview and delete.

**Props:**

```javascript
{
  currentImage: string,           // Current image URL
  onUpload: (file) => Promise,    // Upload handler
  onDelete: () => Promise,        // Delete handler
  type: 'user' | 'provider' | 'service',
  size: 'sm' | 'md' | 'lg' | 'xl',
  shape: 'circle' | 'square' | 'rounded',
  disabled: boolean,
  loading: boolean,
  showDeleteButton: boolean,
  className: string
}
```

**Features:**

- Click-to-upload interface
- Image preview
- File validation (type & size)
- Loading states
- Change/Remove buttons
- Responsive design

**Usage:**

```javascript
<ImageUpload
  currentImage={user.profileImage}
  onUpload={handleImageUpload}
  onDelete={handleImageDelete}
  type="user"
  size="lg"
  shape="circle"
/>
```

#### 3. **ServiceCard** (`components/ServiceCard.jsx`)

Displays service information in a card layout.

**Props:**

```javascript
{
  service: {
    _id: string,
    name: string,
    description: string,
    category: string,
    price: number,
    duration: number,
    image: string,
    rating: number,
    totalReviews: number,
    providerId: {
      businessName: string,
      rating: number
    }
  },
  onBook: (serviceId) => void,    // Optional
  showBookButton: boolean          // Optional
}
```

**Features:**

- Service image display
- Price and duration info
- Provider details
- Rating display
- Book button
- Fallback image

#### 4. **ReviewCard** (`components/ReviewCard.jsx`)

Displays user reviews with ratings.

**Props:**

```javascript
{
  review: {
    userId: { name: string, profileImage: string },
    rating: number,
    comment: string,
    providerResponse: string,
    createdAt: Date
  }
}
```

**Features:**

- Star rating display
- User profile image
- Review text
- Provider response
- Timestamp

#### 5. **ConfirmDialog** (`components/ConfirmDialog.jsx`)

Confirmation modal for destructive actions.

**Props:**

```javascript
{
  isOpen: boolean,
  title: string,
  message: string,
  confirmText: string,          // Default: "Confirm"
  cancelText: string,           // Default: "Cancel"
  onConfirm: () => void,
  onCancel: () => void,
  variant: 'danger' | 'warning' | 'info'
}
```

**Usage:**

```javascript
<ConfirmDialog
  isOpen={showDeleteDialog}
  title="Delete Service"
  message="Are you sure you want to delete this service? This action cannot be undone."
  confirmText="Delete"
  variant="danger"
  onConfirm={handleDelete}
  onCancel={() => setShowDeleteDialog(false)}
/>
```

#### 6. **StatusBadge** (`components/StatusBadge.jsx`)

Colored badge for status indicators.

**Props:**

```javascript
{
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected',
  size: 'sm' | 'md' | 'lg'
}
```

**Status Colors:**

- `pending` → Yellow
- `confirmed` → Blue
- `completed` → Green
- `cancelled` → Gray
- `rejected` → Red

#### 7. **StatCard** (`components/StatCard.jsx`)

Dashboard statistics card.

**Props:**

```javascript
{
  title: string,
  value: string | number,
  icon: Component,
  color: 'blue' | 'green' | 'purple' | 'amber' | 'red',
  trend: number,              // Optional: percentage change
  subtitle: string            // Optional: additional info
}
```

**Usage:**

```javascript
<StatCard
  title="Total Bookings"
  value={stats.totalBookings}
  icon={FiCalendar}
  color="blue"
  trend={12}
  subtitle="vs last month"
/>
```

#### 8. **ProtectedRoute** (`components/ProtectedRoute.jsx`)

Route wrapper for authentication and authorization.

**Props:**

```javascript
{
  children: ReactNode,
  allowedRoles: Array<'user' | 'provider' | 'admin'>
}
```

**Usage:**

```javascript
<Route
  path="/user/dashboard"
  element={
    <ProtectedRoute allowedRoles={["user", "provider"]}>
      <UserDashboard />
    </ProtectedRoute>
  }
/>
```

#### 9. **AdminLayout** (`components/AdminLayout.jsx`)

Layout wrapper for admin pages with sidebar.

**Features:**

- Responsive sidebar
- Mobile menu toggle
- Active route highlighting
- Consistent admin page structure

#### 10. **AdminSidebar** (`components/AdminSidebar.jsx`)

Navigation sidebar for admin panel.

**Features:**

- Icon-based navigation
- Active link highlighting
- Hover effects
- Collapse on mobile

---

## 📄 Pages & Features

### Authentication Pages

#### User Registration (`pages/auth/UserRegister.jsx`)

**Features:**

- Profile image upload during registration
- Form validation
- Password confirmation
- Auto-login after registration
- Phone and address fields

**Form Fields:**

- Name (required)
- Email (required)
- Phone (required)
- Address (required)
- Password (required, min 6 chars)
- Confirm Password (required)
- Profile Image (optional, max 5MB)

#### User Login (`pages/auth/UserLogin.jsx`)

**Features:**

- Email/password authentication
- Remember me option
- Redirect to dashboard
- Error handling
- Link to registration

#### Provider Registration (`pages/auth/ProviderRegister.jsx`)

**Features:**

- Extended registration form
- Business information
- Category selection
- Experience details
- Profile image upload

#### Provider Login (`pages/auth/ProviderLogin.jsx`)

Similar to user login with provider-specific routing.

#### Admin Login (`pages/auth/AdminLogin.jsx`)

Secure login for platform administrators.

---

### User Pages

#### User Dashboard (`pages/user/UserDashboard.jsx`)

**Features:**

- Overview statistics
  - Total bookings
  - Active bookings
  - Completed bookings
  - Total spent
- Recent bookings list
- Quick actions
- Profile image display

**Statistics Cards:**

- Total Bookings
- Active Bookings
- Completed Services
- Total Spent

#### Browse Services (`pages/user/BrowseServices.jsx`)

**Features:**

- Service grid layout
- Search functionality
- Category filter
- Price range filter
- Sort options (price, rating)
- Service cards with images
- Book service modal
- Pagination

**Filters:**

```javascript
{
  search: string,
  category: string,
  minPrice: number,
  maxPrice: number,
  sortBy: 'price' | 'rating'
}
```

#### My Bookings (`pages/user/MyBookings.jsx`)

**Features:**

- Bookings list with filters
- Status-based tabs
- Booking details view
- Cancel booking
- Write review link
- Service provider info

**Booking Status:**

- All
- Pending
- Confirmed
- Completed
- Cancelled

#### Booking Details (`pages/user/BookingDetails.jsx`)

**Features:**

- Complete booking information
- Service details
- Provider information
- Payment breakdown
- Status tracking
- Cancel booking option
- Review submission

**Display Sections:**

- Booking summary
- Service details
- Provider details
- Payment details
- Status timeline

#### Become Provider (`pages/user/BecomeProvider.jsx`)

**Features:**

- Provider application form
- Business image upload
- Category selection
- Experience validation
- Application status check
- Reapplication handling

**Form Fields:**

- Business Name (required)
- Business Description (required)
- Category (required)
- Years of Experience (required)
- Phone Number (required)
- Business Address (required)
- Certifications (optional)
- Portfolio URL (optional)
- Business Image (optional, max 5MB)

**Application States:**

- No application
- Pending review
- Approved (redirect to provider dashboard)
- Rejected (display reason)

#### Write Review (`pages/user/WriteReview.jsx`)

**Features:**

- Star rating input
- Review text
- Booking information display
- Service details
- Provider information
- Validation

**Form:**

```javascript
{
  rating: 1-5,
  comment: string (optional)
}
```

---

### Provider Pages

#### Provider Dashboard (`pages/provider/ProviderDashboard.jsx`)

**Features:**

- Key metrics
  - Total services
  - Active bookings
  - Completed bookings
  - Total earnings
  - Average rating
- Recent bookings
- Quick actions
- Performance charts

**Statistics:**

- Total Services
- Active Bookings
- Completed Services
- Total Earnings
- Average Rating

#### Manage Services (`pages/provider/ManageServices.jsx`)

**Features:**

- Services grid
- Add new service
- Edit service
- Delete service
- Toggle availability
- Image upload (creation & editing)
- Service statistics

**Service Form:**

```javascript
{
  title: string (required),
  description: string (required),
  category: string (required),
  price: number (required),
  duration: number (required, in minutes),
  location: string (optional),
  availability: boolean,
  image: file (optional during creation)
}
```

**Image Upload:**

- During service creation (optional)
- After creation via ImageUpload component
- Change/Remove functionality

#### Booking Requests (`pages/provider/BookingRequests.jsx`)

**Features:**

- Pending bookings list
- Accept booking
- Reject booking (with reason)
- Booking details view
- Customer information
- Status management

**Actions:**

- Accept Request
- Reject Request
- Mark as Complete
- View Details

#### Provider Earnings (`pages/provider/Earnings.jsx`)

**Features:**

- Total earnings overview
- Monthly breakdown
- Payment history
- Platform fee details
- Earnings chart
- Export data

**Metrics:**

- Total Earnings
- Platform Fees
- Net Earnings
- Monthly Earnings

#### Provider Reviews (`pages/provider/Reviews.jsx`)

**Features:**

- All reviews list
- Average rating display
- Respond to reviews
- Filter by rating
- Sort by date

---

### Admin Pages

#### Admin Dashboard (`pages/admin/AdminDashboard.jsx`)

**Features:**

- Platform overview
- Key statistics
  - Total users
  - Total providers
  - Total services
  - Total bookings
  - Total revenue
  - Platform earnings
- Recent activity
- Charts and analytics

**Statistics:**

- Total Users
- Total Providers
- Active Services
- Total Bookings
- Total Revenue
- Platform Earnings
- Pending Applications

#### Manage Users (`pages/admin/ManageUsers.jsx`)

**Features:**

- Users list with search
- User details view
- Block/Unblock users
- User statistics
- Filter by role
- Pagination

**User Actions:**

- View details
- Block account
- Unblock account

#### Manage Providers (`pages/admin/ManageProviders.jsx`)

**Features:**

- Providers list
- Filter by status
- Provider details
- Approve/Reject providers
- View services
- Provider statistics
- Profile image display

**Provider Status:**

- All
- Approved
- Pending
- Rejected

#### Manage Applications (`pages/admin/ManageApplications.jsx`)

**Features:**

- Pending applications list
- Application details
- Approve application
- Reject application (with reason & reapply option)
- Admin notes
- Business image display

**Actions:**

- Approve with notes
- Reject with reason
- Allow/Prevent reapplication

#### Manage Services (`pages/admin/ManageServices.jsx`)

**Features:**

- All services list
- Filter by category
- Search services
- Service details
- Provider information
- Service statistics
- Image upload capability

#### Manage Bookings (`pages/admin/ManageBookings.jsx`)

**Features:**

- All bookings list
- Filter by status
- Booking details
- User & provider info
- Payment details
- Status tracking

#### Manage Reviews (`pages/admin/ManageReviews.jsx`)

**Features:**

- All reviews list
- Filter by rating
- Review moderation
- Provider responses
- Delete inappropriate reviews

#### Manage Categories (`pages/admin/ManageCategories.jsx`)

**Features:**

- Categories list
- Add category
- Edit category
- Delete category
- Service count per category

---

## 🔐 State Management

### AuthContext

**File:** `src/context/AuthContext.jsx`

Centralized authentication state management using React Context.

#### Context State

```javascript
{
  user: {
    id: string,
    name: string,
    email: string,
    role: 'user' | 'provider' | 'admin',
    phone: string,
    address: string,
    profileImage: string
  },
  isAuthenticated: boolean,
  loading: boolean,
  error: string
}
```

#### Context Methods

```javascript
// Login
const { user, login } = useAuth();
await login(email, password, role);

// Register
const { register } = useAuth();
await register(userData);

// Logout
const { logout } = useAuth();
logout();

// Update user image
const { updateUserImage } = useAuth();
updateUserImage(imageUrl);
```

#### Usage Example

```javascript
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### Storage

User data and token stored in `localStorage`:

- `servesync_user` → User object
- `servesync_token` → JWT token
- `servesync_userId` → User ID

---

## 🌐 API Integration

### API Client

**File:** `src/services/api.js`

Centralized API client using Axios with interceptors.

#### Configuration

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

#### Request Interceptor

Automatically adds auth token to requests:

```javascript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("servesync_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Response Interceptor

Handles 401 errors and redirects to login:

```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear storage and redirect
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

### API Methods

#### Auth API

```javascript
import { authAPI } from "../services/api";

// Register (supports FormData for image upload)
await authAPI.register(formData);

// Login
await authAPI.userLogin(email, password);
await authAPI.providerLogin(email, password);
await authAPI.adminLogin(email, password);
```

#### User API

```javascript
import { userAPI } from "../services/api";

// Dashboard
await userAPI.getDashboardStats(userId);

// Profile
await userAPI.getProfile(userId);
await userAPI.updateProfile(userId, data);

// Bookings
await userAPI.bookService(userId, bookingData);
await userAPI.getMyBookings(userId);
await userAPI.getBookingDetails(userId, bookingId);
await userAPI.cancelBooking(userId, bookingId);

// Reviews
await userAPI.submitReview(userId, reviewData);
await userAPI.getMyReviews(userId);

// Provider Application (supports FormData)
await userAPI.submitProviderApplication(userId, formData);
await userAPI.getProviderApplicationStatus(userId);
```

#### Provider API

```javascript
import { providerAPI } from "../services/api";

// Dashboard
await providerAPI.getDashboardStats(userId);

// Services (createService supports FormData)
await providerAPI.createService(userId, formData);
await providerAPI.getMyServices(userId);
await providerAPI.updateService(userId, serviceId, data);
await providerAPI.deleteService(userId, serviceId);
await providerAPI.toggleAvailability(userId, serviceId);

// Bookings
await providerAPI.getBookingRequests(userId);
await providerAPI.acceptBooking(userId, bookingId);
await providerAPI.rejectBooking(userId, bookingId);
await providerAPI.completeBooking(userId, bookingId);

// Earnings
await providerAPI.getEarnings(userId);

// Reviews
await providerAPI.getReviews(userId);
await providerAPI.respondToReview(userId, reviewId, response);
```

#### Admin API

```javascript
import { adminAPI } from "../services/api";

// Dashboard
await adminAPI.getStats();

// Users
await adminAPI.getUsers(params);
await adminAPI.toggleBlockUser(userId);

// Providers
await adminAPI.getProviders(params);
await adminAPI.getPendingProviders();
await adminAPI.approveProvider(providerId, data);
await adminAPI.rejectProvider(providerId, data);

// Services
await adminAPI.getAllServices(params);

// Bookings
await adminAPI.getAllBookings(params);

// Categories
await adminAPI.getCategories();
await adminAPI.createCategory(data);
await adminAPI.updateCategory(categoryId, data);
await adminAPI.deleteCategory(categoryId);
```

#### Service API

```javascript
import { serviceAPI } from "../services/api";

// Public endpoints
await serviceAPI.getAll(params);
await serviceAPI.search(query);
await serviceAPI.getByCategory(category);
await serviceAPI.getById(serviceId);
```

#### Upload API

```javascript
import { uploadAPI } from "../services/api";

// Upload images
await uploadAPI.uploadUserImage(userId, file);
await uploadAPI.uploadProviderImage(userId, file);
await uploadAPI.uploadServiceImage(serviceId, file);

// Delete images
await uploadAPI.deleteUserImage(userId);
await uploadAPI.deleteProviderImage(userId);
await uploadAPI.deleteServiceImage(serviceId);
```

---

## 🔑 Authentication Flow

### Login Flow

1. User enters credentials
2. Call appropriate login API (user/provider/admin)
3. Receive JWT token and user data
4. Store in localStorage
5. Update AuthContext
6. Redirect to dashboard

```javascript
const handleLogin = async (email, password, role) => {
  try {
    await login(email, password, role);
    navigate(`/${role}/dashboard`);
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Registration Flow

1. User fills registration form
2. Optional: Upload profile image
3. Submit FormData to API
4. Auto-login after successful registration
5. Redirect to dashboard

```javascript
const handleRegister = async (formData) => {
  try {
    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    // ... other fields
    if (profileImage) {
      submitData.append("profileImage", profileImage);
    }

    await register(submitData);
    await login(formData.email, formData.password, "user");
    navigate("/user/dashboard");
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Protected Routes

```javascript
<Route
  path="/user/dashboard"
  element={
    <ProtectedRoute allowedRoles={["user", "provider"]}>
      <UserDashboard />
    </ProtectedRoute>
  }
/>
```

### Logout Flow

1. Call logout from AuthContext
2. Clear localStorage
3. Clear context state
4. Redirect to landing page

```javascript
const handleLogout = () => {
  logout();
  navigate("/");
};
```

---

## 🎨 Styling & UI

### Tailwind CSS

Custom configuration in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {...},
      secondary: {...}
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif']
    }
  }
}
```

### Common CSS Classes

#### Buttons

```javascript
// Primary Button
className = "btn-primary";
// Equivalent: bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700

// Secondary Button
className = "btn-secondary";
// Equivalent: bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200
```

#### Input Fields

```javascript
className = "input-field";
// Equivalent: w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
```

#### Cards

```javascript
className = "bg-white border border-gray-200 rounded-lg shadow-sm p-6";
```

### Responsive Design

Mobile-first approach with Tailwind breakpoints:

```javascript
// Mobile: default
// Tablet: sm: (640px)
// Desktop: md: (768px), lg: (1024px), xl: (1280px)

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Toast Notifications

Using React Hot Toast for user feedback:

```javascript
import toast from "react-hot-toast";

// Success
toast.success("Operation successful!");

// Error
toast.error("Something went wrong");

// Loading
const toastId = toast.loading("Processing...");
toast.dismiss(toastId);
```

### Icons

React Icons library:

```javascript
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";

<FiUser className="text-xl text-blue-600" />;
```

---

## 📸 Image Upload

### Upload Flow

1. **User clicks upload area** or "Add photo" button
2. **File selected** from device
3. **Validation** (type & size)
4. **Preview displayed** instantly
5. **Upload to backend** (optional during creation, required for update)
6. **Server processes** and stores in Cloudinary
7. **URL returned** and saved in database
8. **UI updated** with new image

### Implementation

#### During Registration/Creation

```javascript
const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
};

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  if (imageFile) {
    formData.append("profileImage", imageFile);
  }
  await authAPI.register(formData);
};
```

#### After Creation (Using ImageUpload Component)

```javascript
<ImageUpload
  currentImage={user.profileImage}
  onUpload={async (file) => {
    const response = await uploadAPI.uploadUserImage(user.id, file);
    updateUserImage(response.data.data);
    toast.success("Profile image updated");
  }}
  onDelete={async () => {
    await uploadAPI.deleteUserImage(user.id);
    updateUserImage(null);
    toast.success("Profile image removed");
  }}
  type="user"
  size="lg"
  shape="circle"
/>
```

### File Validation

```javascript
// Allowed types
const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Max size: 5MB
const maxSize = 5 * 1024 * 1024;

// Validation
if (!allowedTypes.includes(file.type)) {
  toast.error("Please select a valid image file");
  return;
}

if (file.size > maxSize) {
  toast.error("Image size must be less than 5MB");
  return;
}
```

---

## 🛠️ Best Practices

### Code Organization

1. **Component Structure**

   ```javascript
   // Imports
   import React, { useState, useEffect } from "react";

   // Component
   const MyComponent = () => {
     // State
     const [data, setData] = useState([]);

     // Effects
     useEffect(() => {
       fetchData();
     }, []);

     // Handlers
     const handleClick = () => {};

     // Render
     return <div>...</div>;
   };

   export default MyComponent;
   ```

2. **API Calls**
   - Always use try-catch
   - Show loading states
   - Handle errors gracefully
   - Display success messages

3. **Form Handling**
   - Validate on submit
   - Show validation errors
   - Disable submit during loading
   - Clear form after success

### Error Handling

```javascript
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await api.getData();
    setData(response.data);
  } catch (error) {
    console.error("Error:", error);
    setError(error.response?.data?.message || "Failed to load data");
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
```

### Performance Optimization

1. **Lazy Loading**

   ```javascript
   const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
   ```

2. **Memoization**

   ```javascript
   const expensiveValue = useMemo(() => computeExpensiveValue(data), [data]);
   ```

3. **Debouncing**
   ```javascript
   const debouncedSearch = useCallback(
     debounce((query) => searchServices(query), 500),
     [],
   );
   ```

### Accessibility

1. **Semantic HTML**

   ```javascript
   <button> instead of <div onClick>
   <nav>, <main>, <section>, <article>
   ```

2. **ARIA Labels**

   ```javascript
   <button aria-label="Close dialog">
     <FiX />
   </button>
   ```

3. **Keyboard Navigation**
   - Tab through interactive elements
   - Enter/Space for buttons
   - Escape to close modals

### Security

1. **XSS Prevention**
   - React automatically escapes content
   - Be careful with `dangerouslySetInnerHTML`

2. **Authentication**
   - Always check auth state
   - Protect sensitive routes
   - Clear tokens on logout

3. **Input Validation**
   - Validate on frontend
   - Sanitize user input
   - Validate on backend too

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Generates optimized files in `dist/` folder.

### Environment Variables

Production `.env`:

```
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Deployment Platforms

#### Vercel

```bash
npm install -g vercel
vercel
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

#### Static Hosting

Upload `dist/` folder to:

- GitHub Pages
- AWS S3
- Firebase Hosting
- Cloudflare Pages

### Production Checklist

- [ ] Set production API URL
- [ ] Test all routes
- [ ] Verify authentication
- [ ] Check image uploads
- [ ] Test mobile responsive
- [ ] Optimize images
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up error monitoring
- [ ] Test payment flow
- [ ] Verify all user roles

---

## 📱 Mobile Responsiveness

All pages are mobile-first and responsive:

- **Mobile**: Clean, single-column layouts
- **Tablet**: 2-column grids where appropriate
- **Desktop**: Full multi-column layouts with sidebars

### Responsive Patterns

```javascript
// Navigation: Hamburger menu on mobile
<div className="hidden md:flex">Desktop Nav</div>
<div className="md:hidden">Mobile Menu</div>

// Grids: Adapt columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

// Sidebar: Hide on mobile
<div className="hidden lg:block">Sidebar</div>
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication

- [ ] User registration with image
- [ ] User login
- [ ] Provider login
- [ ] Admin login
- [ ] Logout
- [ ] Protected routes

#### User Flow

- [ ] Browse services
- [ ] Search and filter
- [ ] Book service
- [ ] View bookings
- [ ] Cancel booking
- [ ] Write review
- [ ] Apply for provider

#### Provider Flow

- [ ] Create service with image
- [ ] Edit service
- [ ] Upload/change service image
- [ ] Accept booking
- [ ] Complete booking
- [ ] View earnings
- [ ] Respond to reviews

#### Admin Flow

- [ ] View statistics
- [ ] Manage users
- [ ] Approve providers
- [ ] Manage services
- [ ] View all bookings

---

## 📞 Support

### Common Issues

**Issue:** API connection failed

- Check backend is running
- Verify API URL in `.env`
- Check CORS settings

**Issue:** Images not uploading

- Verify Cloudinary config on backend
- Check file size (< 5MB)
- Check file format (JPG, PNG, GIF, WebP)

**Issue:** Routes not working

- Check route paths match exactly
- Verify authentication
- Check user role permissions

---

## 📄 License

ISC License

---

**Last Updated:** January 19, 2026  
**Version:** 1.0.0  
**Built with:** React, Vite, Tailwind CSS, React Router

// Mock user data
export const mockUsers = {
  user: {
    id: 1,
    name: 'John Doe',
    email: 'user@servesync.com',
    role: 'user',
    phone: '+1234567890',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  provider: {
    id: 2,
    name: 'Jane Smith',
    email: 'provider@servesync.com',
    role: 'provider',
    phone: '+1234567891',
    avatar: 'https://i.pravatar.cc/150?img=2',
    rating: 4.8,
    completedJobs: 156
  },
  admin: {
    id: 3,
    name: 'Admin User',
    email: 'admin@servesync.com',
    role: 'admin',
    phone: '+1234567892',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
}

// Mock services data
export const mockServices = [
  {
    id: 1,
    name: 'Home Cleaning',
    description: 'Professional deep cleaning service for your home',
    price: 89,
    duration: '2-3 hours',
    rating: 4.8,
    reviews: 245,
    category: 'Cleaning',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop',
    providerId: 2
  },
  {
    id: 2,
    name: 'Plumbing Repair',
    description: 'Expert plumbing services for all your needs',
    price: 120,
    duration: '1-2 hours',
    rating: 4.9,
    reviews: 189,
    category: 'Repair',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop',
    providerId: 2
  },
  {
    id: 3,
    name: 'Electrical Work',
    description: 'Licensed electrician for installations and repairs',
    price: 150,
    duration: '2-4 hours',
    rating: 4.7,
    reviews: 156,
    category: 'Repair',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400&h=300&fit=crop',
    providerId: 2
  },
  {
    id: 4,
    name: 'AC Maintenance',
    description: 'Complete AC servicing and repair',
    price: 95,
    duration: '1-2 hours',
    rating: 4.6,
    reviews: 134,
    category: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=400&h=300&fit=crop',
    providerId: 2
  },
  {
    id: 5,
    name: 'Pest Control',
    description: 'Safe and effective pest elimination',
    price: 75,
    duration: '1 hour',
    rating: 4.9,
    reviews: 201,
    category: 'Cleaning',
    image: 'https://images.unsplash.com/photo-1563122234-8253ea72ca4d?w=400&h=300&fit=crop',
    providerId: 2
  },
  {
    id: 6,
    name: 'Gardening',
    description: 'Professional garden maintenance and landscaping',
    price: 65,
    duration: '2-3 hours',
    rating: 4.5,
    reviews: 98,
    category: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    providerId: 2
  }
]

// Mock bookings data
export const mockBookings = [
  {
    id: 1,
    serviceId: 1,
    serviceName: 'Home Cleaning',
    customerId: 1,
    customerName: 'John Doe',
    providerId: 2,
    providerName: 'Jane Smith',
    date: '2024-03-25',
    time: '10:00 AM',
    status: 'pending',
    amount: 89,
    address: '123 Main St, Apt 4B'
  },
  {
    id: 2,
    serviceId: 2,
    serviceName: 'Plumbing Repair',
    customerId: 1,
    customerName: 'John Doe',
    providerId: 2,
    providerName: 'Jane Smith',
    date: '2024-03-20',
    time: '2:00 PM',
    status: 'completed',
    amount: 120,
    address: '123 Main St, Apt 4B'
  },
  {
    id: 3,
    serviceId: 3,
    serviceName: 'Electrical Work',
    customerId: 1,
    customerName: 'John Doe',
    providerId: 2,
    providerName: 'Jane Smith',
    date: '2024-03-28',
    time: '11:00 AM',
    status: 'confirmed',
    amount: 150,
    address: '123 Main St, Apt 4B'
  }
]

// Mock API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// API functions
export const api = {
  // Auth
  login: async (email, password, role) => {
    await delay(800)
    if (password === 'password') {
      return { success: true, user: mockUsers[role] }
    }
    throw new Error('Invalid credentials')
  },

  // Services
  getServices: async () => {
    await delay(500)
    return mockServices
  },

  getServiceById: async (id) => {
    await delay(300)
    return mockServices.find(s => s.id === parseInt(id))
  },

  // Bookings
  getBookings: async (userId, role) => {
    await delay(500)
    if (role === 'user') {
      return mockBookings.filter(b => b.customerId === userId)
    } else if (role === 'provider') {
      return mockBookings.filter(b => b.providerId === userId)
    }
    return mockBookings
  },

  createBooking: async (bookingData) => {
    await delay(800)
    return {
      id: Math.floor(Math.random() * 1000),
      ...bookingData,
      status: 'pending'
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    await delay(500)
    return { success: true, bookingId, status }
  },

  // Stats
  getStats: async (role) => {
    await delay(500)
    if (role === 'admin') {
      return {
        totalUsers: 1245,
        totalProviders: 89,
        totalBookings: 3456,
        revenue: 125490,
        activeBookings: 156,
        completedToday: 45
      }
    } else if (role === 'provider') {
      return {
        totalBookings: 156,
        earnings: 18750,
        rating: 4.8,
        activeRequests: 8
      }
    }
    return {
      activeBookings: 2,
      completedBookings: 15,
      totalSpent: 1890
    }
  }
}

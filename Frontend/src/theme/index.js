// Central Theme Configuration for ServeSync
// This file contains all the theme-related constants used across the application

export const theme = {
  // Color Palette
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Main primary
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b", // Main secondary
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
    },
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
    },
    info: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
    },
  },

  // Status Badge Colors
  statusColors: {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    accepted: "bg-blue-100 text-blue-800 border-blue-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    inactive: "bg-gray-100 text-gray-600 border-gray-200",
  },

  // Role-specific colors (for login pages, dashboards, etc.)
  roleColors: {
    user: {
      primary: "bg-blue-600",
      light: "bg-blue-50",
      border: "border-blue-600",
      text: "text-blue-600",
      hover: "hover:bg-blue-700",
    },
    provider: {
      primary: "bg-indigo-600",
      light: "bg-indigo-50",
      border: "border-indigo-600",
      text: "text-indigo-600",
      hover: "hover:bg-indigo-700",
    },
    admin: {
      primary: "bg-slate-800",
      light: "bg-slate-50",
      border: "border-slate-800",
      text: "text-slate-800",
      hover: "hover:bg-slate-900",
    },
  },

  // Common Component Styles
  components: {
    // Cards
    card: "bg-white border border-gray-200 rounded-lg shadow-sm",
    cardHover:
      "bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow",

    // Buttons
    btnPrimary:
      "bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors",
    btnSecondary:
      "bg-white text-gray-700 px-6 py-2.5 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors",
    btnOutline:
      "bg-transparent text-blue-600 px-6 py-2.5 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors",
    btnDanger:
      "bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors",

    // Inputs
    input:
      "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",
    inputIcon:
      "w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors",

    // Navigation
    navLink: "text-gray-600 hover:text-blue-600 font-medium transition-colors",
    navLinkActive: "text-blue-600 font-medium",

    // Badges
    badge:
      "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border",

    // Stats
    statCard: "bg-white border border-gray-200 rounded-lg p-6 shadow-sm",
  },

  // Layout
  layout: {
    maxWidth: "max-w-7xl",
    containerPadding: "px-4 sm:px-6 lg:px-8",
    sectionPadding: "py-8",
    pageBackground: "bg-gray-50 min-h-screen",
  },

  // Typography
  typography: {
    h1: "text-3xl font-bold text-gray-900",
    h2: "text-2xl font-bold text-gray-900",
    h3: "text-xl font-semibold text-gray-900",
    h4: "text-lg font-semibold text-gray-900",
    body: "text-gray-600",
    bodySmall: "text-sm text-gray-500",
    label: "text-sm font-medium text-gray-700",
  },
};

// Helper function to get status color
export const getStatusColor = (status) => {
  return theme.statusColors[status] || theme.statusColors.pending;
};

// Helper function to get role color
export const getRoleColor = (role, variant = "primary") => {
  return theme.roleColors[role]?.[variant] || theme.roleColors.user[variant];
};

export default theme;

import User from "../models/User.js";
import Provider from "../models/Provider.js";
import { generateToken, apiResponse } from "../utils/helpers.js";

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, name, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(apiResponse(false, "Email already registered"));
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
      phone,
      address,
      role: "user",
    });

    await user.save();

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res
      .status(201)
      .json(apiResponse(true, "User registered successfully", userObj));
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Registration failed", error.message));
  }
};

// Register new provider
export const registerProvider = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      phone,
      address,
      businessName,
      description,
      category,
      experience,
      certifications,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json(apiResponse(false, "Email already registered"));
    }

    // Create new user with provider role
    const user = new User({
      email,
      password,
      name,
      phone,
      address,
      role: "user", // Start as user, will be updated to provider after approval
    });

    await user.save();

    // Create provider profile
    const provider = new Provider({
      userId: user._id,
      businessName,
      description,
      category,
      experience: experience || 0,
      certifications: certifications || [],
      status: "pending", // Requires admin approval
    });

    await provider.save();

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json(
      apiResponse(true, "Provider registration submitted for approval", {
        user: userObj,
        provider,
      }),
    );
  } catch (error) {
    res
      .status(500)
      .json(apiResponse(false, "Registration failed", error.message));
  }
};

// User login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, role: "user" });
    if (!user) {
      return res.status(401).json(apiResponse(false, "Invalid credentials"));
    }

    // Check if blocked
    if (user.isBlocked) {
      return res
        .status(403)
        .json(apiResponse(false, "Your account has been blocked"));
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json(apiResponse(false, "Invalid credentials"));
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.json(
      apiResponse(true, "Login successful", {
        token,
        user: userObj,
      }),
    );
  } catch (error) {
    res.status(500).json(apiResponse(false, "Login failed", error.message));
  }
};

// Provider login
export const providerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, role: "provider" });
    if (!user) {
      return res.status(401).json(apiResponse(false, "Invalid credentials"));
    }

    // Check if blocked
    if (user.isBlocked) {
      return res
        .status(403)
        .json(apiResponse(false, "Your account has been blocked"));
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json(apiResponse(false, "Invalid credentials"));
    }

    // Get provider details
    const provider = await Provider.findOne({ userId: user._id });

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.json(
      apiResponse(true, "Login successful", {
        token,
        user: userObj,
        provider,
      }),
    );
  } catch (error) {
    res.status(500).json(apiResponse(false, "Login failed", error.message));
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      return res.status(401).json(apiResponse(false, "Invalid credentials"));
    }

    // Check if blocked
    if (user.isBlocked) {
      return res
        .status(403)
        .json(apiResponse(false, "Your account has been blocked"));
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json(apiResponse(false, "Invalid credentials"));
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.json(
      apiResponse(true, "Login successful", {
        token,
        user: userObj,
      }),
    );
  } catch (error) {
    res.status(500).json(apiResponse(false, "Login failed", error.message));
  }
};

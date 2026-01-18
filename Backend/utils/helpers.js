import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const apiResponse = (success, message, data = null) => {
  return {
    success,
    message,
    data,
  };
};

export { generateToken, apiResponse };

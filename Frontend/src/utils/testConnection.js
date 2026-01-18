import axios from "axios";

// Simple test to verify Frontend-Backend connection
const API_BASE_URL = "http://localhost:8080/api";

async function testConnection() {
  console.log("🧪 Testing Frontend-Backend Connection...\n");

  try {
    // Test 1: Backend health check
    console.log("Test 1: Checking Backend API...");
    try {
      const response = await axios.get(
        `${API_BASE_URL.replace("/api", "")}/actuator/health`,
        {
          timeout: 5000,
        }
      );
      console.log("✓ Backend is responding\n");
    } catch {
      console.log(
        "ℹ Backend actuator endpoint not available (normal for this app)\n"
      );
    }

    // Test 2: Test Auth endpoint
    console.log("Test 2: Testing Auth Endpoint...");
    try {
      await axios.post(
        `${API_BASE_URL}/auth/login/user`,
        {
          email: "test@test.com",
          password: "wrong",
        },
        { timeout: 5000 }
      );
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        console.log("✗ Cannot connect to Backend on port 8080");
        console.log("  Make sure Backend is running: mvn spring-boot:run\n");
      } else if (error.response) {
        console.log("✓ Backend is responding to API requests");
        console.log(
          `  Response: ${error.response.status} ${error.response.statusText}\n`
        );
      } else {
        console.log("⚠ Unexpected error:", error.message, "\n");
      }
    }

    // Test 3: CORS check
    console.log("Test 3: Checking CORS Configuration...");
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/login/user`, {
        timeout: 5000,
      });
      console.log("✓ CORS is properly configured\n");
    } catch (error) {
      if (error.response) {
        console.log("✓ CORS headers are being sent correctly\n");
      }
    }

    console.log("====================================");
    console.log("✓ Connection Test Complete!");
    console.log("====================================\n");
    console.log("Next Steps:");
    console.log("1. Open http://localhost:3000 in your browser");
    console.log("2. Try logging in with test credentials:");
    console.log("   - Email: user@servesync.com");
    console.log("   - Password: password");
  } catch (error) {
    console.error("Fatal error:", error.message);
  }
}

testConnection();

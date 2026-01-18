import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiStar,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import { serviceAPI, userAPI, paymentAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState(user?.address || "");
  const [notes, setNotes] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const timeSlots = [
    "09:00 AM",
    "11:00 AM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM",
  ];

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const response = await serviceAPI.getServiceById(id);
      const data = response.data?.data || response.data;
      setService(data);
    } catch (error) {
      console.error("Error loading service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time");
      return;
    }
    if (!address.trim()) {
      alert("Please enter service address");
      return;
    }
    setShowPayment(true);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);

      // First create the booking
      const bookingData = {
        serviceId: service._id,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        userAddress: address,
        notes: notes,
      };

      const bookingResponse = await userAPI.bookService(user.id, bookingData);
      const booking = bookingResponse.data?.data || bookingResponse.data;

      if (!booking || !booking._id) {
        throw new Error("Failed to create booking");
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load payment gateway. Please try again.");
        setProcessing(false);
        return;
      }

      // Create Razorpay order
      const orderResponse = await paymentAPI.createOrder(booking._id);
      const orderData = orderResponse.data?.data || orderResponse.data;

      // Razorpay options
      const options = {
        key: orderData.keyId, // Key ID from backend
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ServeSync",
        description: `Booking for ${service.name}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            };

            await paymentAPI.verifyPayment(verifyData);

            alert("Payment successful! Booking confirmed.");
            navigate("/user/bookings");
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "",
        },
        theme: {
          color: "#0EA5E9",
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            alert("Payment cancelled. Your booking is still pending payment.");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setProcessing(false);
    } catch (error) {
      console.error("Payment error:", error);
      const errorMsg =
        error.response?.data?.message || "Payment failed. Please try again.";
      alert(errorMsg);
      setProcessing(false);
    }
  };

  const navLinks = [
    { path: "/user/dashboard", label: "Dashboard" },
    { path: "/user/services", label: "Browse Services" },
    { path: "/user/bookings", label: "My Bookings" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-blue"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <Navbar role="user" links={navLinks} />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-400">Service not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar role="user" links={navLinks} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Service Details */}
          <div className="glass-card overflow-hidden mb-8">
            <div className="h-64 md:h-96 overflow-hidden">
              <img
                src={service.image || "https://via.placeholder.com/800x400"}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8">
              <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
              <p className="text-gray-400 mb-6">{service.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <FiStar className="text-yellow-400 fill-current" />
                  <span className="font-semibold">{service.rating}</span>
                  <span className="text-gray-500">
                    ({service.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <FiClock />
                  <span>{service.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiDollarSign className="text-neon-green" />
                  <span className="text-2xl font-bold text-neon-green">
                    ₹{service.price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!showPayment ? (
            /* Booking Form */
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">Select Date & Time</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                    <FiCalendar className="mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                    <FiClock className="mr-2" />
                    Select Time Slot
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border transition-all ${
                          selectedTime === time
                            ? "bg-neon-blue border-neon-blue text-white"
                            : "bg-dark-card border-white/20 hover:border-neon-blue"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center">
                    <FiMapPin className="mr-2" />
                    Service Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-field"
                    rows="3"
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field"
                    rows="2"
                    placeholder="Any special instructions?"
                  />
                </div>

                <motion.button
                  onClick={handleBooking}
                  className="btn-primary w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Payment
                </motion.button>
              </div>
            </div>
          ) : (
            /* Payment Modal */
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FiCreditCard className="mr-3 text-neon-blue" />
                Payment Details
              </h2>

              <div className="bg-dark-card p-6 rounded-lg mb-6">
                <h3 className="font-semibold mb-4">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service</span>
                    <span>{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date & Time</span>
                    <span>
                      {selectedDate} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Service Fee</span>
                    <span>₹{service.price?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform Fee (10%)</span>
                    <span>₹{(service.price * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-neon-green">
                      ₹{(service.price * 1.1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-card p-4 rounded-lg mb-6 border border-neon-blue/20">
                <p className="text-sm text-gray-300 flex items-center">
                  <FiCreditCard className="mr-2 text-neon-blue" />
                  Payment powered by Razorpay - Secure & Fast
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowPayment(false)}
                  className="btn-secondary flex-1"
                  disabled={processing}
                >
                  Back
                </button>
                <motion.button
                  onClick={handlePayment}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!processing ? { scale: 1.02 } : {}}
                  whileTap={!processing ? { scale: 0.98 } : {}}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Pay with Razorpay"}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookingDetails;

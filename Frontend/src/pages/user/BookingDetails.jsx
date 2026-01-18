import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiStar,
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiPackage,
  FiUser,
} from "react-icons/fi";
import Navbar from "../../components/Navbar";
import ServiceReviews from "../../components/ServiceReviews";
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
      toast.error("Please select date and time");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter service address");
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
        toast.error("Failed to load payment gateway. Please try again.");
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

            toast.success("Payment successful! Booking confirmed.");
            navigate("/user/bookings");
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
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
            toast("Payment cancelled. Your booking is still pending payment.", {
              icon: "⚠️",
            });
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
      toast.error(errorMsg);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar role="user" links={navLinks} />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500">Service not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar role="user" links={navLinks} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* Service Details */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
            <div className="h-64 md:h-96 overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiPackage className="w-24 h-24 text-white/50" />
                </div>
              )}
            </div>

            <div className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {service.name}
              </h1>
              <p className="text-gray-600 mb-6">{service.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <FiStar className="text-amber-500 fill-current" />
                  <span className="font-semibold text-gray-900">
                    {service.rating || 0}
                  </span>
                  <span className="text-gray-500">
                    ({service.reviewCount || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiClock />
                  <span>{service.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiDollarSign className="text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    ₹{service.price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {!showPayment ? (
            /* Booking Form */
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Select Date & Time
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-medium mb-2 text-gray-700">
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
                  <label className="flex items-center text-sm font-medium mb-2 text-gray-700">
                    <FiClock className="mr-2" />
                    Select Time Slot
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border transition-colors ${
                          selectedTime === time
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-200 hover:border-blue-600 text-gray-700"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium mb-2 text-gray-700">
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
                  <label className="block text-sm font-medium mb-2 text-gray-700">
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

                <button onClick={handleBooking} className="btn-primary w-full">
                  Proceed to Payment
                </button>
              </div>
            </div>
          ) : (
            /* Payment Modal */
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiCreditCard className="mr-3 text-blue-600" />
                Payment Details
              </h2>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Booking Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service</span>
                    <span className="text-gray-900">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date & Time</span>
                    <span className="text-gray-900">
                      {selectedDate} at {selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service Fee</span>
                    <span className="text-gray-900">
                      ₹{service.price?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Platform Fee (10%)</span>
                    <span className="text-gray-900">
                      ₹{(service.price * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-green-600">
                      ₹{(service.price * 1.1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <p className="text-sm text-gray-700 flex items-center">
                  <FiCreditCard className="mr-2 text-blue-600" />
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
                <button
                  onClick={handlePayment}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Pay with Razorpay"}
                </button>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {!showPayment && service && (
            <div className="mt-8">
              <ServiceReviews serviceId={service._id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;

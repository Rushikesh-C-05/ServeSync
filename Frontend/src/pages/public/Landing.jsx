import { Link, useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiUser,
  FiTool,
  FiArrowRight,
  FiStar,
  FiClock,
  FiDollarSign,
  FiShield,
  FiPackage,
  FiTrendingUp,
  FiMenu,
  FiX,
  FiZap,
  FiAward,
  FiLock,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCheckCircle,
  FiUsers,
  FiTarget,
  FiHeart,
  FiThumbsUp,
  FiHome,
} from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../../components/AuthModal";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    type: "user-login",
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const openAuthModal = (type) => {
    setAuthModal({ isOpen: true, type });
    setMobileMenuOpen(false);
  };

  const switchAuthModal = (type) => {
    setAuthModal({ isOpen: true, type });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, type: "user-login" });
  };

  const features = [
    {
      icon: FiStar,
      title: "Top Rated Services",
      description: "Vetted professionals with 4.5+ ratings",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      icon: FiClock,
      title: "Quick Booking",
      description: "Book services in under 2 minutes",
      color: "text-user",
      bgColor: "bg-user-light",
    },
    {
      icon: FiDollarSign,
      title: "Transparent Pricing",
      description: "No hidden fees, pay what you see",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: FiShield,
      title: "Secure Payments",
      description: "Your money is protected until job completion",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: FiZap,
      title: "Instant Notifications",
      description: "Real-time updates on booking status",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: FiAward,
      title: "Quality Assurance",
      description: "Verified and background-checked providers",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      icon: FiLock,
      title: "Data Protection",
      description: "Your personal information is encrypted and secure",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: FiUsers,
      title: "24/7 Support",
      description: "Customer support available round the clock",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      image: "SJ",
      rating: 5,
      comment:
        "ServeSync made finding a reliable plumber so easy! Booked in minutes and the service was excellent. Highly recommend!",
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      image: "MC",
      rating: 5,
      comment:
        "As a provider, this platform has helped me grow my business significantly. The booking system is seamless and payment is always on time.",
    },
    {
      name: "Emily Rodriguez",
      role: "Apartment Resident",
      image: "ER",
      rating: 5,
      comment:
        "I've used ServeSync for cleaning, repairs, and gardening. Every provider has been professional and the pricing is always fair.",
    },
  ];

  const serviceCategories = [
    {
      icon: FiTool,
      title: "Home Repairs",
      services: ["Plumbing", "Electrical", "Carpentry", "HVAC"],
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: FiHome,
      title: "Cleaning Services",
      services: [
        "House Cleaning",
        "Deep Cleaning",
        "Window Cleaning",
        "Carpet Cleaning",
      ],
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: FiTarget,
      title: "Professional Services",
      services: ["IT Support", "Tutoring", "Photography", "Event Planning"],
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: FiHeart,
      title: "Personal Care",
      services: ["Beauty & Spa", "Fitness Training", "Pet Care", "Healthcare"],
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  const whyChooseUs = [
    {
      icon: FiCheckCircle,
      title: "Verified Professionals",
      description:
        "Every service provider undergoes thorough background checks and verification processes to ensure your safety and satisfaction.",
    },
    {
      icon: FiThumbsUp,
      title: "Best Price Guarantee",
      description:
        "Compare prices from multiple providers and choose the best deal. We ensure competitive pricing without compromising quality.",
    },
    {
      icon: FiShield,
      title: "Satisfaction Guaranteed",
      description:
        "If you're not completely satisfied with the service, we offer a money-back guarantee and will help you find a better solution.",
    },
    {
      icon: FiUsers,
      title: "Community Driven",
      description:
        "Built on trust and transparency with real reviews from real customers. Join thousands of satisfied users in your area.",
    },
  ];

  const roles = [
    {
      title: "Find Services",
      subtitle: "For Customers",
      role: "user",
      icon: FiUser,
      bgColor: "bg-user",
      borderColor: "border-user",
      features: [
        "Browse local services",
        "Instant booking",
        "Secure payments",
        "Rate & review",
      ],
      cta: "Find Services",
    },
    {
      title: "Offer Services",
      subtitle: "For Providers",
      role: "provider",
      icon: FiTool,
      bgColor: "bg-provider",
      borderColor: "border-provider",
      features: [
        "List your services",
        "Manage bookings",
        "Track earnings",
        "Build reputation",
      ],
      cta: "Become a Provider",
    },
  ];

  const stats = [
    { icon: FiUser, value: "10K+", label: "Active Users" },
    { icon: FiPackage, value: "5K+", label: "Services Listed" },
    { icon: FiStar, value: "4.8", label: "Average Rating" },
    { icon: FiTrendingUp, value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-card border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">
                  S
                </span>
              </div>
              <span className="text-xl font-bold text-foreground">
                ServeSync
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
              {user ? (
                <Button asChild>
                  <Link to={`/${user.role}/dashboard`}>Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => openAuthModal("user-login")}
                  >
                    Sign In
                  </Button>
                  <Button onClick={() => openAuthModal("user-register")}>
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg"
              >
                How It Works
              </a>
              {user ? (
                <Link
                  to={`/${user.role}/dashboard`}
                  className="block py-2 px-4 bg-user text-white rounded-lg text-center font-medium"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal("user-login")}
                    className="block w-full py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg text-left"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal("user-register")}
                    className="block w-full py-2 px-4 bg-user text-white rounded-lg text-center font-medium"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-background overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left space-y-8">
              <div>
                <Badge className="mb-4 text-sm px-4 py-1.5">
                  🎉 Trusted by 10,000+ Happy Customers
                </Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                  <span className="text-foreground">Connect with</span>
                  <br />
                  <span className="text-primary">Trusted Service</span>
                  <br />
                  <span className="text-foreground">Providers</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Book verified professionals for home services, repairs,
                  cleaning, and more. Fast, reliable, and affordable service
                  marketplace at your fingertips.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => openAuthModal("user-register")}
                  className="group w-full sm:w-auto text-lg px-8 py-6 shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto text-lg px-8 py-6 border-2"
                >
                  <a href="#how-it-works">See How It Works</a>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-user border-2 border-background flex items-center justify-center text-xs font-semibold text-user-foreground"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    10K+ Users
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FiStar
                      key={i}
                      className="text-amber-400 fill-amber-400"
                      size={16}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground font-medium ml-2">
                    4.8/5 Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative">
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-user/10 rounded-full blur-3xl -z-10" />

                {/* Main Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-card">
                  <img
                    src="/HeroImage.png"
                    alt="Service booking platform illustration"
                    className="w-full h-auto object-cover"
                  />

                  {/* Floating Stats Cards */}
                  <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-border animate-pulse">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FiCheckCircle className="text-emerald-600" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Success Rate
                        </p>
                        <p className="text-sm font-bold text-foreground">98%</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-border animate-pulse"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiClock className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Avg Response
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          2 mins
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 lg:mt-24">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center group hover:shadow-lg transition-all duration-300 border-2"
              >
                <CardContent className="p-6">
                  <stat.icon className="text-3xl text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive features designed to make booking and providing
              services effortless and secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`text-3xl ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Popular Categories</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Browse Services by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect service for your needs from our wide range of
              categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <Card
                key={index}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <category.icon className={`text-3xl ${category.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {category.title}
                  </h3>
                  <ul className="space-y-2">
                    {category.services.map((service, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-muted-foreground text-sm"
                      >
                        <FiCheck
                          className="text-primary mr-2 flex-shrink-0"
                          size={14}
                        />
                        {service}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={() => openAuthModal("user-register")}
              className="border-2"
            >
              Explore All Categories
              <FiArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Why ServeSync</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Your Trust is Our Priority
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the best experience for both
              customers and service providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-2"
              >
                <CardContent className="p-8 flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className="text-2xl text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers and providers who trust
              ServeSync
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-2"
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {testimonial.image}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar
                        key={i}
                        className="text-amber-400 fill-amber-400"
                        size={16}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{testimonial.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Get Started</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you need services or want to offer them, we've got the
              perfect solution for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {roles.map((role, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 hover:border-primary/50"
              >
                <CardContent className="p-10">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 ${role.bgColor} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <role.icon className="text-3xl" />
                  </div>

                  {/* Title */}
                  <div className="mb-6">
                    <Badge variant={role.role} className="mb-3">
                      {role.subtitle}
                    </Badge>
                    <h3 className="text-3xl font-bold text-foreground mb-2">
                      {role.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {role.role === "user"
                        ? "Find and book trusted professionals for any service you need"
                        : "Grow your business by connecting with customers in your area"}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {role.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center space-x-3 text-muted-foreground"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                          <FiCheck className="text-emerald-600 text-sm" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() =>
                      openAuthModal(
                        role.role === "user" ? "user-login" : "provider-login",
                      )
                    }
                    variant={role.role}
                    size="lg"
                    className="w-full text-lg shadow-lg"
                  >
                    {role.cta}
                    <FiArrowRight className="ml-2" />
                  </Button>

                  {role.role === "user" && (
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                      New user?{" "}
                      <button
                        onClick={() => openAuthModal("user-register")}
                        className="text-user hover:text-user/80 font-semibold underline"
                      >
                        Create an account
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Simple Process</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get the service you need in three easy steps - it's that simple!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines (Hidden on mobile) */}
            <div
              className="hidden md:block absolute top-24 left-1/4 right-1/4 h-1 bg-primary/20"
              style={{ transform: "translateY(-50%)" }}
            />

            {[
              {
                step: "01",
                title: "Browse & Select",
                desc: "Explore our wide range of services and choose the one that fits your needs perfectly",
                icon: FiPackage,
                color: "bg-blue-50 text-blue-600",
              },
              {
                step: "02",
                title: "Book & Pay Securely",
                desc: "Select your preferred time slot and make a secure payment through our protected gateway",
                icon: FiLock,
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                step: "03",
                title: "Track & Review",
                desc: "Monitor service progress in real-time and share your experience to help others",
                icon: FiStar,
                color: "bg-amber-50 text-amber-600",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="relative group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
              >
                <CardContent className="p-8 text-center">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {item.step}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4 group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className="text-4xl" />
                  </div>

                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => openAuthModal("user-register")}
              className="shadow-lg text-lg px-8 py-6"
            >
              Start Booking Now
              <FiArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of satisfied customers and providers. Sign up today
            and experience the future of service booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => openAuthModal("user-register")}
              className="text-lg px-8 py-6 shadow-xl"
            >
              Get Started for Free
              <FiArrowRight className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => openAuthModal("provider-login")}
              className="text-lg px-8 py-6 border-2 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            >
              Become a Provider
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">
                    S
                  </span>
                </div>
                <span className="text-xl font-bold text-white">ServeSync</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Your trusted platform for booking and providing services.
                Connecting customers with quality service providers since 2024.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="mailto:support@servesync.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FiMail size={16} />
                  <span className="text-sm">support@servesync.com</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => openAuthModal("user-register")}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Sign Up
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openAuthModal("provider-login")}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Become a Provider
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => openAuthModal("admin-login")}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Admin Login
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 ServeSync. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-400 text-sm">
                Made with ❤️ for better service
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        type={authModal.type}
        onSwitchModal={switchAuthModal}
      />
    </div>
  );
};

export default Landing;

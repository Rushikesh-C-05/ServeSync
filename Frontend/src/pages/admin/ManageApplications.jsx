import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiAward,
} from "react-icons/fi";
import AdminLayout from "../../components/AdminLayout";
import { adminAPI } from "../../services/api";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const statusParam = filter === "all" ? null : filter;
        const response = await adminAPI.getProviderApplications(statusParam);
        setApplications(response.data.data || []);
      } catch (error) {
        
        toast.error("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const statusParam = filter === "all" ? null : filter;
      const response = await adminAPI.getProviderApplications(statusParam);
      setApplications(response.data.data || []);
    } catch (error) {
      
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setAdminNotes("");
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;

    try {
      setActionLoading(true);
      await adminAPI.approveProviderApplication(
        selectedApplication._id,
        adminNotes,
      );
      toast.success("Application approved successfully!");
      setShowModal(false);
      fetchApplications();
    } catch (error) {
      
      toast.error(
        error.response?.data?.message ||
          "Failed to approve application. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;
    if (!adminNotes.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setActionLoading(true);
      await adminAPI.rejectProviderApplication(
        selectedApplication._id,
        adminNotes,
      );
      toast.success("Application rejected successfully!");
      setShowModal(false);
      fetchApplications();
    } catch (error) {
      
      toast.error(
        error.response?.data?.message ||
          "Failed to reject application. Please try again.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-600", icon: FiClock },
      approved: {
        color: "bg-green-100 text-green-600",
        icon: FiCheckCircle,
      },
      rejected: { color: "bg-red-100 text-red-600", icon: FiXCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1`}
      >
        <Icon className="w-3 h-3" />
        {status.toUpperCase()}
      </span>
    );
  };

  const filteredApplications = applications;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Provider Applications 📋
              </h1>
              <p className="text-gray-500">
                Review and manage provider applications
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-indigo-600">
                {applications.length}
              </p>
              <p className="text-sm text-gray-500">Total Applications</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg p-2 mb-6 inline-flex">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-md transition-colors ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-6 py-2 rounded-md transition-colors ${
              filter === "pending"
                ? "bg-yellow-500 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-6 py-2 rounded-md transition-colors ${
              filter === "approved"
                ? "bg-green-500 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-6 py-2 rounded-md transition-colors ${
              filter === "rejected"
                ? "bg-red-500 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-xl text-gray-500">
              No {filter !== "all" ? filter : ""} applications found
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredApplications.map((application) => (
              <div
                key={application._id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-indigo-400 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold">
                        {application.businessName}
                      </h3>
                      {getStatusBadge(application.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Applicant</p>
                        <p className="font-medium">
                          {application.userId?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Category</p>
                        <p className="font-medium">{application.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Experience</p>
                        <p className="font-medium">{application.experience}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Submitted</p>
                        <p className="font-medium">
                          {new Date(
                            application.submittedAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetails(application)}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <FiEye />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {selectedApplication.businessName}
                </h2>
                {getStatusBadge(selectedApplication.status)}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Applicant Info */}
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <FiMail className="text-blue-600" />
                  Applicant Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Name</p>
                    <p className="font-medium">
                      {selectedApplication.userId?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="font-medium">
                      {selectedApplication.userId?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="font-medium">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Address</p>
                    <p className="font-medium">{selectedApplication.address}</p>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <FiBriefcase className="text-indigo-600" />
                  Business Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Description</p>
                    <p className="text-gray-600">
                      {selectedApplication.businessDescription}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Category</p>
                      <p className="font-medium">
                        {selectedApplication.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Experience</p>
                      <p className="font-medium">
                        {selectedApplication.experience}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {(selectedApplication.certifications ||
                selectedApplication.portfolio) && (
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <FiAward className="text-yellow-500" />
                    Additional Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    {selectedApplication.certifications && (
                      <div>
                        <p className="text-gray-400">Certifications</p>
                        <p className="text-gray-600">
                          {selectedApplication.certifications}
                        </p>
                      </div>
                    )}
                    {selectedApplication.portfolio && (
                      <div>
                        <p className="text-gray-400">Portfolio</p>
                        <a
                          href={selectedApplication.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedApplication.portfolio}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin Notes Input (only for pending applications) */}
              {selectedApplication.status === "pending" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Admin Notes{" "}
                    {selectedApplication.status === "pending" &&
                      "(Required for rejection)"}
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full h-24 resize-none px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
                    placeholder="Add notes about the decision..."
                  />
                </div>
              )}

              {/* Existing Admin Notes (for reviewed applications) */}
              {selectedApplication.status !== "pending" &&
                selectedApplication.adminNotes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Admin Notes</p>
                    <p className="text-gray-600">
                      {selectedApplication.adminNotes}
                    </p>
                    {selectedApplication.reviewedBy && (
                      <p className="text-xs text-gray-400 mt-2">
                        Reviewed by: {selectedApplication.reviewedBy.name} on{" "}
                        {new Date(
                          selectedApplication.reviewedAt,
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

              {/* Action Buttons (only for pending applications) */}
              {selectedApplication.status === "pending" && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="flex-1 bg-white border border-red-300 p-3 hover:bg-red-50 transition-colors text-red-600 font-medium rounded-lg disabled:opacity-50"
                  >
                    {actionLoading ? "Processing..." : "Reject Application"}
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 p-3 rounded-lg font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? "Processing..." : "Approve Application"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageApplications;

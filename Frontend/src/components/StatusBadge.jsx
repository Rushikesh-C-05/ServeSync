const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  active: "bg-emerald-100 text-emerald-800 border-emerald-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`status-badge border ${statusColors[status] || statusColors.pending}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;

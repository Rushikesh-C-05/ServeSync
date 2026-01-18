const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  accepted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  active: "bg-neon-blue/20 text-neon-blue border-neon-blue/30",
  inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
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

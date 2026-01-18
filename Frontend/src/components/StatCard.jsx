const iconColors = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
  amber: "bg-amber-100 text-amber-600",
  red: "bg-red-100 text-red-600",
  indigo: "bg-indigo-100 text-indigo-600",
};

const StatCard = ({ icon: Icon, label, value, color = "blue", trend }) => {
  const colorClass = iconColors[color] || iconColors.blue;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {trend && (
            <p
              className={`text-sm mt-2 ${trend > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;

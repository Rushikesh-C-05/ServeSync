import { Card } from "./ui/card";
import { cn } from "../lib/utils";

const iconColors = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-emerald-100 text-emerald-600",
  purple: "bg-purple-100 text-purple-600",
  amber: "bg-amber-100 text-amber-600",
  red: "bg-red-100 text-red-600",
  indigo: "bg-indigo-100 text-indigo-600",
  admin: "bg-admin-light text-admin",
  provider: "bg-provider-light text-provider",
  user: "bg-user-light text-user",
};

const StatCard = ({ icon: Icon, label, value, color = "blue", trend }) => {
  const colorClass = iconColors[color] || iconColors.blue;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
          {trend && (
            <p
              className={cn(
                "text-sm mt-2",
                trend > 0 ? "text-emerald-600" : "text-red-600",
              )}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colorClass)}>
          <Icon className="text-xl" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;

import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

const statusVariants = {
  pending: "warning",
  accepted: "default",
  confirmed: "default",
  completed: "success",
  cancelled: "destructive",
  rejected: "destructive",
  active: "success",
  inactive: "secondary",
};

const StatusBadge = ({ status }) => {
  const variant = statusVariants[status] || "warning";

  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
};

export default StatusBadge;

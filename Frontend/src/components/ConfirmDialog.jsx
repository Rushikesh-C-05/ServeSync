import { FiAlertTriangle } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger", // danger, warning, info
}) => {
  const typeStyles = {
    danger: {
      icon: "bg-red-100 text-red-600",
    },
    warning: {
      icon: "bg-amber-100 text-amber-600",
    },
    info: {
      icon: "bg-blue-100 text-blue-600",
    },
  };

  const styles = typeStyles[type] || typeStyles.danger;

  const getButtonVariant = () => {
    if (type === "danger") return "destructive";
    return "default";
  };

  const getButtonClasses = () => {
    if (type === "warning") return "bg-amber-600 hover:bg-amber-700";
    if (type === "info") return "bg-blue-600 hover:bg-blue-700";
    return "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-full ${styles.icon} flex items-center justify-center mx-auto mb-4`}
          >
            <FiAlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-row gap-3 sm:gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {cancelText}
          </Button>
          <Button
            variant={getButtonVariant()}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 ${getButtonClasses()}`}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;

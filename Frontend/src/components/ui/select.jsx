import * as React from "react";
import { cn } from "../../lib/utils";
import { FiChevronDown, FiCheck } from "react-icons/fi";

const SelectContext = React.createContext();

const Select = ({ value, onValueChange, children, ...props }) => {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleValueChange = (newValue) => {
    setInternalValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value: internalValue,
        onValueChange: handleValueChange,
      }}
    >
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext);

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <FiChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform",
            open && "transform rotate-180",
          )}
        />
      </button>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext);
  const [displayValue, setDisplayValue] = React.useState("");

  React.useEffect(() => {
    // This will be set by SelectItem when mounted
  }, [value]);

  return (
    <span className={cn(!value && "text-gray-500")}>
      {displayValue || placeholder || "Select an option"}
    </span>
  );
};
SelectValue.displayName = "SelectValue";

const SelectContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext);
    const contentRef = React.useRef(null);

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (contentRef.current && !contentRef.current.contains(event.target)) {
          const trigger = contentRef.current.previousElementSibling;
          if (trigger && !trigger.contains(event.target)) {
            setOpen(false);
          }
        }
      };

      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open, setOpen]);

    if (!open) return null;

    return (
      <div
        ref={contentRef}
        className={cn(
          "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(
  ({ className, children, value: itemValue, ...props }, ref) => {
    const { value, onValueChange } = React.useContext(SelectContext);
    const isSelected = value === itemValue;

    return (
      <div
        ref={ref}
        onClick={() => onValueChange(itemValue)}
        className={cn(
          "relative cursor-pointer select-none py-2 pl-8 pr-4 hover:bg-gray-100 focus:bg-gray-100",
          isSelected && "bg-gray-50 font-medium",
          className,
        )}
        {...props}
      >
        {isSelected && (
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <FiCheck className="h-4 w-4" />
          </span>
        )}
        <span className="block truncate">{children}</span>
      </div>
    );
  },
);
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };

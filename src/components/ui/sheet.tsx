import * as React from "react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetTriggerProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  side?: 'left' | 'right';
}

interface SheetOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SheetContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

export const Sheet = ({ children, open, onOpenChange }: SheetProps) => {
  const [isOpen, setIsOpen] = React.useState(open || false);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      setIsOpen(value);
      onOpenChange?.(value);
    },
    [onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

export const SheetTrigger = ({ children, className, asChild }: SheetTriggerProps) => {
  const { onOpenChange } = React.useContext(SheetContext);
  const Comp = asChild ? React.Fragment : 'button';
  
  return (
    <Comp 
      onClick={() => onOpenChange(true)}
      className={className}
    >
      {children}
    </Comp>
  );
};

export const SheetOverlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(
  ({ className, ...props }, ref) => {
    const { open, onOpenChange } = React.useContext(SheetContext);
    if (!open) return null;

    return createPortal(
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className
        )}
        onClick={() => onOpenChange(false)}
        {...props}
      />,
      document.body
    );
  }
);
SheetOverlay.displayName = "SheetOverlay";

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ children, className, side = 'right', ...props }, ref) => {
    const { open } = React.useContext(SheetContext);
    if (!open) return null;

    return createPortal(
      <div
        ref={ref}
        className={cn(
          "fixed inset-y-0 z-50 h-full w-3/4 bg-cuba-warmBeige p-6 shadow-lg transition-transform duration-300 ease-in-out data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full sm:max-w-sm",
          side === 'left' ? 'left-0' : 'right-0',
          className
        )}
        {...props}
      >
        {children}
      </div>,
      document.body
    );
  }
);
SheetContent.displayName = "SheetContent";

export const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

export const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

export const SheetTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

export const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export const SheetClose = ({ children }: { children: React.ReactNode }) => {
  const { onOpenChange } = React.useContext(SheetContext);
  return (
    <button onClick={() => onOpenChange(false)} className="absolute right-4 top-4">
      {children}
    </button>
  );
};
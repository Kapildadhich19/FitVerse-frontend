"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from "react";

import { cn } from "@/lib/utils";

type ToastInput = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
};

type ToastItem = ToastInput & {
  id: string;
};

type ToastContextValue = {
  toast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    const id = crypto.randomUUID();
    setToasts((currentToasts) => [...currentToasts, { ...input, id }]);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {toasts.map((toastItem) => (
          <ToastPrimitive.Root
            key={toastItem.id}
            className={cn(
              "grid w-full max-w-sm gap-1 rounded-lg border bg-card p-4 text-card-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
              toastItem.variant === "destructive" && "border-destructive text-destructive"
            )}
            duration={4000}
            onOpenChange={(open) => {
              if (!open) {
                dismiss(toastItem.id);
              }
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <ToastPrimitive.Title className="text-sm font-semibold">{toastItem.title}</ToastPrimitive.Title>
                {toastItem.description ? (
                  <ToastPrimitive.Description className="text-sm text-muted-foreground">
                    {toastItem.description}
                  </ToastPrimitive.Description>
                ) : null}
              </div>
              <ToastPrimitive.Close className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                <X className="h-4 w-4" />
              </ToastPrimitive.Close>
            </div>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed right-4 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 outline-none" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

/**
 * Hotel PMS - Toaster Component
 * Toast notification container that renders all toasts
 */

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toastIconMap,
} from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';

/**
 * Toaster component - renders all active toasts
 */
export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Get icon for variant
        const IconComponent = variant ? toastIconMap[variant] : null;

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-3">
              {/* Icon */}
              {IconComponent && (
                <IconComponent className="h-5 w-5 shrink-0 mt-0.5" />
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

/**
 * Hotel PMS - Modal Component
 * Generic modal wrapper using Dialog component
 */

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Modal props
 */
export interface ModalProps {
  // Modal visibility
  open: boolean;
  // Callback when modal should close
  onOpenChange: (open: boolean) => void;
  // Modal title
  title?: React.ReactNode;
  // Modal description
  description?: React.ReactNode;
  // Modal content
  children: React.ReactNode;
  // Footer content or actions
  footer?: React.ReactNode;
  // Size variant
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
  // Show close button
  showCloseButton?: boolean;
  // Prevent closing on outside click
  preventClose?: boolean;
  // Additional class names
  className?: string;
}

/**
 * Size class map
 */
const sizeClasses = {
  sm: 'max-w-sm',
  default: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[90vw]',
};

/**
 * Modal component
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'default',
  showCloseButton = true,
  preventClose = false,
  className,
}: ModalProps) {
  // Handle open change with preventClose option
  const handleOpenChange = (newOpen: boolean) => {
    if (preventClose && !newOpen) {
      return; // Prevent closing
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(sizeClasses[size], className)}
        showCloseButton={showCloseButton}
        onPointerDownOutside={preventClose ? (e) => e.preventDefault() : undefined}
        onEscapeKeyDown={preventClose ? (e) => e.preventDefault() : undefined}
      >
        {/* Header */}
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}

        {/* Content */}
        {children}

        {/* Footer */}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Confirmation modal for delete/destructive actions
 */
export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  loading?: boolean;
  variant?: 'default' | 'destructive';
}

export function ConfirmModal({
  open,
  onOpenChange,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'default',
}: ConfirmModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            isLoading={loading}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div />
    </Modal>
  );
}

/**
 * Form modal for forms with submit/cancel actions
 */
export interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  onSubmit: () => void;
  onCancel?: () => void;
  loading?: boolean;
  size?: ModalProps['size'];
}

export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitText = 'Save',
  cancelText = 'Cancel',
  onSubmit,
  onCancel,
  loading = false,
  size = 'default',
}: FormModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size={size}
      preventClose={loading}
      footer={
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button onClick={onSubmit} isLoading={loading}>
            {submitText}
          </Button>
        </div>
      }
    >
      {children}
    </Modal>
  );
}

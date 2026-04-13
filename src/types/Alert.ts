export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  type: AlertType;
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
  duration?: number;
  showProgress?: boolean;
}

export interface AlertState {
  id: string;
  type: AlertType;
  title: string;
  description?: string;
  duration?: number;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}


export const alertConfig = {
  success: {
    bgColor: 'bg-emerald-50/95',
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-700',
    titleColor: 'text-emerald-900',
    progressColor: 'bg-emerald-500',
  },
  error: {
    bgColor: 'bg-red-50/95',
    borderColor: 'border-red-500',
    textColor: 'text-red-700',
    titleColor: 'text-red-900',
    progressColor: 'bg-red-500',
  },
  warning: {
    bgColor: 'bg-amber-50/95',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-700',
    titleColor: 'text-amber-900',
    progressColor: 'bg-amber-500',
  },
  info: {
    bgColor: 'bg-blue-50/95',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-700',
    titleColor: 'text-blue-900',
    progressColor: 'bg-blue-500',
  },
};
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { HiInformationCircle } from "react-icons/hi";
import { HiExclamationTriangle } from "react-icons/hi2";

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
    bgColor: 'bg-green-900/90',
    borderColor: 'border-green-700',
    textColor: 'text-green-100',
    titleColor: 'text-green-50',
    icon: FiCheckCircle,
  },
  error: {
    bgColor: 'bg-red-900/90',
    borderColor: 'border-red-700',
    textColor: 'text-red-100',
    titleColor: 'text-red-50',
    icon: FiXCircle,
  },
  warning: {
    bgColor: 'bg-yellow-900/90',
    borderColor: 'border-yellow-700',
    textColor: 'text-yellow-100',
    titleColor: 'text-yellow-50',
    icon: HiExclamationTriangle,
  },
  info: {
    bgColor: 'bg-blue-900/90',
    borderColor: 'border-blue-700',
    textColor: 'text-blue-100',
    titleColor: 'text-blue-50',
    icon: HiInformationCircle,
  },
};
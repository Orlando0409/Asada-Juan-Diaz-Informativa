import { useState, useCallback, useRef } from 'react';
import type { AlertState, AlertType } from '../types/Alert';


export const useAlert = () => {
  const [alerts, setAlerts] = useState<AlertState[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const alertTimestamps = useRef<number[]>([]);
  const MAX_ALERTS = 4;
  const ALERT_LIMIT_TIME = 5000;
  const BLOCK_DURATION = 5000;

      // Función para generar IDs únicos más robustos
  const generateUniqueId = useCallback(() => {
    return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }, []);


  const showAlert = useCallback(
    (type: AlertType, title: string, description?: string, duration: number = 4000, actionButton?: { text: string; onClick: () => void }) => {
      // Si está bloqueado, no mostrar nuevas alertas normales
      if (isBlocked && type !== 'warning') return;

      // Detectar spam
      const now = Date.now();
      alertTimestamps.current.push(now);
      alertTimestamps.current = alertTimestamps.current.filter(
        timestamp => now - timestamp < ALERT_LIMIT_TIME
      );

      if (alertTimestamps.current.length >= MAX_ALERTS && !isBlocked) {
        setIsBlocked(true);
        setRemainingTime(BLOCK_DURATION / 1000);

        const warningId = Date.now().toString();
        const warningAlert: AlertState = {
          id: warningId,
          type: 'warning',
          title: 'Demasiados intentos',
          description: `Espera ${BLOCK_DURATION / 1000} segundos antes de intentar de nuevo.`,
          duration: BLOCK_DURATION
        };
        setAlerts(prev => [...prev, warningAlert].slice(-MAX_ALERTS));

        setTimeout(() => {
          setAlerts(prev => prev.filter(alert => alert.id !== warningId));
        }, BLOCK_DURATION);

        setTimeout(() => {
          setIsBlocked(false);
          setRemainingTime(0);
          alertTimestamps.current = [];
        }, BLOCK_DURATION);

        return warningId;
      }

      const id = generateUniqueId();
      const newAlert: AlertState = { id, type, title, description, duration, actionButton };
      setAlerts(prev => [...prev, newAlert].slice(-MAX_ALERTS));

      if (duration > 0) {
        setTimeout(() => {
          setAlerts(prev => prev.filter(alert => alert.id !== id));
        }, duration);
      }
      return id;
    },
    [isBlocked]
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const showSuccess = useCallback(
    (title: string, description?: string, duration?: number) =>
      showAlert('success', title, description, duration),
    [showAlert]
  );
  const showError = useCallback(
    (title: string, description?: string, duration?: number) =>
      showAlert('error', title, description, duration),
    [showAlert]
  );
  const showWarning = useCallback(
    (title: string, description?: string, duration?: number) =>
      showAlert('warning', title, description, duration),
    [showAlert]
  );
  const showInfo = useCallback(
    (title: string, description?: string, duration?: number) =>
      showAlert('info', title, description, duration),
    [showAlert]
  );

  const showSuccessWithUndo = useCallback(
    (title: string, description: string, undoAction: () => void, duration: number = 6000) => {
      let alertId: string = '';
      const actionButton = {
        text: 'Deshacer',
        onClick: () => {
          undoAction();
          if (alertId) {
            setAlerts(prev => prev.filter(alert => alert.id !== alertId));
          }
        }
      };
      const id = showAlert('success', title, description, duration, actionButton);
      alertId = id || '';
      return id;
    },
    [showAlert]
  );

  return {
    alerts,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showSuccessWithUndo,
    removeAlert,
    clearAlerts,
    isBlocked,
    remainingTime,
  };
};
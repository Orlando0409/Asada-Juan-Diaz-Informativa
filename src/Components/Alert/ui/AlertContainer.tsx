import React from 'react';
import { Alert } from './Alert';
import { useAlerts } from '../../../context/AlertContext';


export const AlertContainer: React.FC = () => {
  const { alerts, removeAlert } = useAlerts();

  return (
    <div className="fixed top-4 right-4 z-100 space-y-2 max-w-sm w-full">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          type={alert.type}
          title={alert.title}
          description={alert.description}
          onClose={() => removeAlert(alert.id)}
          actionButton={alert.actionButton}
        />
      ))}
    </div>
  );
};
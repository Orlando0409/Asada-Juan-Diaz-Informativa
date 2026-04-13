import React, { createContext, lazy, Suspense, useContext, type ReactNode } from 'react';
import { useAlert } from '../Hook/useAlert';

const AlertContainer = lazy(() =>
  import('../Components/Alert/ui/AlertContainer').then((module) => ({ default: module.AlertContainer }))
);

type AlertContextType = ReturnType<typeof useAlert>;

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const alertMethods = useAlert();

  return (
    <AlertContext.Provider value={alertMethods}>
      {children}
      {alertMethods.alerts.length > 0 && (
        <Suspense fallback={null}>
          <AlertContainer />
        </Suspense>
      )}
    </AlertContext.Provider>
  );
};

export const useAlerts = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
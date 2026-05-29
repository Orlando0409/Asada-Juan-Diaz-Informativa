import { CiWifiOn, CiWifiOff } from "react-icons/ci";

// Indicador de estado online/offline
export function StatusIndicator({ isOnline }: Readonly<{ isOnline: boolean }>) {
  return (
    <div className="flex items-center space-x-1">
      {isOnline ? (
        <>
          <CiWifiOn className="size-4 text-green-500" />
          <span className="text-xs text-green-600">En línea</span>
        </>
      ) : (
        <>
          <CiWifiOff className="size-4 text-orange-500" />
          <span className="text-xs text-orange-600">Sin conexión</span>
        </>
      )}
    </div>
  );
}

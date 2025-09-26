'use client';

import { BluetoothDeviceInfo } from '@/lib/bluetooth';

interface ConnectionStatusProps {
  isAvailable: boolean;
  connectedDevice: BluetoothDeviceInfo | null;
  isScanning: boolean;
}

export function ConnectionStatus({ 
  isAvailable, 
  connectedDevice, 
  isScanning 
}: ConnectionStatusProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full ${
            isAvailable 
              ? 'bg-green-500 animate-pulse' 
              : 'bg-red-500'
          }`}></div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bluetooth Status
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAvailable 
                ? 'Bluetooth is available and ready' 
                : 'Bluetooth is not available'
              }
            </p>
          </div>
        </div>
        
        <div className="text-right">
          {connectedDevice ? (
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Connected to {connectedDevice.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Device ID: {connectedDevice.id}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No device connected
            </p>
          )}
        </div>
      </div>
      
      {isScanning && (
        <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm font-medium">Scanning for devices...</span>
        </div>
      )}
    </div>
  );
}

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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-5 h-5 rounded-full ${
            isAvailable 
              ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50' 
              : 'bg-red-500 shadow-lg shadow-red-500/50'
          }`}></div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
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
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-4 py-3 rounded-xl border border-green-200 dark:border-green-800">
              <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                Connected to {connectedDevice.name}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 font-mono">
                {connectedDevice.id}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No device connected
              </p>
            </div>
          )}
        </div>
      </div>
      
      {isScanning && (
        <div className="mt-6 flex items-center gap-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm font-semibold">Scanning for devices...</span>
        </div>
      )}
    </div>
  );
}

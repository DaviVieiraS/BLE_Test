'use client';

import { useState } from 'react';
import { useBluetooth } from '@/hooks/useBluetooth';
import { DeviceCard } from './DeviceCard';
import { ConnectionStatus } from './ConnectionStatus';
import { ErrorMessage } from './ErrorMessage';

export function BluetoothInterface() {
  const {
    isSupported,
    isAvailable,
    devices,
    connectedDevice,
    isScanning,
    error,
    scanForDevices,
    connect,
    disconnect,
    getBatteryLevel,
    clearError,
    clearDevices,
  } = useBluetooth();

  const [batteryLevels, setBatteryLevels] = useState<Record<string, number | null>>({});

  const handleScan = async () => {
    await scanForDevices();
  };

  const handleConnect = async (deviceId: string) => {
    const success = await connect(deviceId);
    if (success) {
      // Try to get battery level for connected device
      const batteryLevel = await getBatteryLevel(deviceId);
      setBatteryLevels(prev => ({
        ...prev,
        [deviceId]: batteryLevel,
      }));
    }
  };

  const handleDisconnect = async (deviceId: string) => {
    await disconnect(deviceId);
    setBatteryLevels(prev => {
      const newLevels = { ...prev };
      delete newLevels[deviceId];
      return newLevels;
    });
  };

  const handleGetBatteryLevel = async (deviceId: string) => {
    const level = await getBatteryLevel(deviceId);
    setBatteryLevels(prev => ({
      ...prev,
      [deviceId]: level,
    }));
  };

  if (!isSupported) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
          Bluetooth Not Supported
        </div>
        <p className="text-red-500 dark:text-red-300">
            Your device or browser doesn&apos;t support the Web Bluetooth API. 
            Please use a compatible browser like Chrome, Edge, or Opera.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Connection Status */}
      <ConnectionStatus 
        isAvailable={isAvailable}
        connectedDevice={connectedDevice}
        isScanning={isScanning}
      />

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error}
          onDismiss={clearError}
        />
      )}

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={handleScan}
          disabled={isScanning || !isAvailable}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5 disabled:transform-none"
        >
          {isScanning ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Scanning...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Scan for Devices
            </>
          )}
        </button>

        {devices.length > 0 && (
          <button
            onClick={clearDevices}
            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Devices
          </button>
        )}
      </div>

      {/* Device List */}
      {devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              batteryLevel={batteryLevels[device.id]}
              onConnect={() => handleConnect(device.id)}
              onDisconnect={() => handleDisconnect(device.id)}
              onGetBatteryLevel={() => handleGetBatteryLevel(device.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            No devices found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Click &quot;Scan for Devices&quot; to discover nearby Bluetooth devices and start controlling them
          </p>
        </div>
      )}
    </div>
  );
}

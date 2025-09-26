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
    <div className="space-y-6">
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
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleScan}
          disabled={isScanning || !isAvailable}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          {isScanning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Scanning...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Scan for Devices
            </>
          )}
        </button>

        {devices.length > 0 && (
          <button
            onClick={clearDevices}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Devices
          </button>
        )}
      </div>

      {/* Device List */}
      {devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No devices found
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Click &quot;Scan for Devices&quot; to discover nearby Bluetooth devices
          </p>
        </div>
      )}
    </div>
  );
}

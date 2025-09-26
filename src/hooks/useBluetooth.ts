'use client';

import { useState, useEffect, useCallback } from 'react';
import { BluetoothManager, BluetoothService } from '@/lib/bluetooth';

export function useBluetooth() {
  const [bluetoothManager] = useState(() => new BluetoothManager());
  const [state, setState] = useState<BluetoothService>(bluetoothManager.state);

  const updateState = useCallback(() => {
    setState(bluetoothManager.state);
  }, [bluetoothManager]);

  useEffect(() => {
    updateState();
  }, [updateState]);

  const scanForDevices = useCallback(async () => {
    await bluetoothManager.scanForDevices();
    updateState();
  }, [bluetoothManager, updateState]);

  const connect = useCallback(async (deviceId: string) => {
    const success = await bluetoothManager.connect(deviceId);
    updateState();
    return success;
  }, [bluetoothManager, updateState]);

  const disconnect = useCallback(async (deviceId?: string) => {
    const success = await bluetoothManager.disconnect(deviceId);
    updateState();
    return success;
  }, [bluetoothManager, updateState]);

  const getBatteryLevel = useCallback(async (deviceId: string) => {
    const level = await bluetoothManager.getBatteryLevel(deviceId);
    updateState();
    return level;
  }, [bluetoothManager, updateState]);

  const clearError = useCallback(() => {
    bluetoothManager.clearError();
    updateState();
  }, [bluetoothManager, updateState]);

  const clearDevices = useCallback(() => {
    bluetoothManager.clearDevices();
    updateState();
  }, [bluetoothManager, updateState]);

  return {
    ...state,
    scanForDevices,
    connect,
    disconnect,
    getBatteryLevel,
    clearError,
    clearDevices,
  };
}

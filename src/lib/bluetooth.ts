export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  device: BluetoothDevice;
  connected: boolean;
}

export interface BluetoothService {
  isSupported: boolean;
  isAvailable: boolean;
  devices: BluetoothDeviceInfo[];
  connectedDevice: BluetoothDeviceInfo | null;
  isScanning: boolean;
  error: string | null;
}

export class BluetoothManager {
  private devices: BluetoothDeviceInfo[] = [];
  private connectedDevice: BluetoothDeviceInfo | null = null;
  private isScanning = false;
  private error: string | null = null;

  constructor() {
    this.checkSupport();
  }

  get isSupported(): boolean {
    return 'bluetooth' in navigator;
  }

  get isAvailable(): boolean {
    return this.isSupported && navigator.bluetooth !== undefined;
  }

  get state(): BluetoothService {
    return {
      isSupported: this.isSupported,
      isAvailable: this.isAvailable,
      devices: this.devices,
      connectedDevice: this.connectedDevice,
      isScanning: this.isScanning,
      error: this.error,
    };
  }

  private checkSupport(): void {
    if (!this.isSupported) {
      this.error = 'Bluetooth is not supported on this device';
    }
  }

  async requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDeviceInfo | null> {
    if (!this.isAvailable) {
      this.error = 'Bluetooth is not available';
      return null;
    }

    try {
      this.error = null;
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information'],
        ...options,
      });

      const bluetoothDevice: BluetoothDeviceInfo = {
        id: device.id,
        name: device.name || 'Unknown Device',
        device: device,
        connected: false,
      };

      // Check if device already exists
      const existingIndex = this.devices.findIndex(d => d.id === device.id);
      if (existingIndex >= 0) {
        this.devices[existingIndex] = bluetoothDevice;
      } else {
        this.devices.push(bluetoothDevice);
      }

      return bluetoothDevice;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to request device';
      return null;
    }
  }

  async scanForDevices(): Promise<void> {
    if (!this.isAvailable) {
      this.error = 'Bluetooth is not available';
      return;
    }

    this.isScanning = true;
    this.error = null;

    try {
      // Request device with scanning
      const device = await this.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information'],
      });

      if (device) {
        console.log('Found device:', device.name);
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to scan for devices';
    } finally {
      this.isScanning = false;
    }
  }

  async connect(deviceId: string): Promise<boolean> {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) {
      this.error = 'Device not found';
      return false;
    }

    try {
      this.error = null;
      await device.device.gatt?.connect();
      device.connected = true;
      this.connectedDevice = device;
      return true;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to connect to device';
      return false;
    }
  }

  async disconnect(deviceId?: string): Promise<boolean> {
    const targetDevice = deviceId 
      ? this.devices.find(d => d.id === deviceId)
      : this.connectedDevice;

    if (!targetDevice) {
      this.error = 'Device not found';
      return false;
    }

    try {
      this.error = null;
      if (targetDevice.device.gatt?.connected) {
        targetDevice.device.gatt.disconnect();
      }
      targetDevice.connected = false;
      
      if (this.connectedDevice?.id === targetDevice.id) {
        this.connectedDevice = null;
      }
      
      return true;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to disconnect from device';
      return false;
    }
  }

  async getBatteryLevel(deviceId: string): Promise<number | null> {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device || !device.connected) {
      this.error = 'Device not connected';
      return null;
    }

    try {
      const server = await device.device.gatt?.connect();
      if (!server) {
        this.error = 'Failed to connect to GATT server';
        return null;
      }

      const batteryService = await server.getPrimaryService('battery_service');
      const batteryLevelCharacteristic = await batteryService.getCharacteristic('battery_level');
      const batteryLevel = await batteryLevelCharacteristic.readValue();
      
      return batteryLevel.getUint8(0);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to read battery level';
      return null;
    }
  }

  clearError(): void {
    this.error = null;
  }

  clearDevices(): void {
    this.devices = [];
    this.connectedDevice = null;
  }
}

'use client';

import { useState } from 'react';
import { useBluetooth } from '@/hooks/useBluetooth';

export function SimpleBLEInterface() {
  const { connectedDevice } = useBluetooth();
  const [isSending, setIsSending] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [deviceStatus, setDeviceStatus] = useState<string>('online');

  const sendCommand = async (command: string, data?: any) => {
    if (!connectedDevice) {
      setLastMessage('❌ Please connect to a device first');
      return;
    }

    setIsSending(true);
    setLastMessage('');

    try {
      // Simulate sending command to BLE device
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLastMessage(`✅ ${command} sent successfully`);
      console.log('BLE Command:', command, data);
      
      // TODO: Implement actual BLE data transmission
      // Example: await connectedDevice.gatt.writeCharacteristic(characteristic, data);
      
    } catch (error) {
      setLastMessage(`❌ Failed to send command: ${error}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'turn-on':
        sendCommand('Turn device ON', { action: 'turn_on' });
        break;
      case 'turn-off':
        sendCommand('Turn device OFF', { action: 'turn_off' });
        break;
      case 'get-status':
        sendCommand('Get device status', { action: 'get_status' });
        break;
      case 'reset':
        sendCommand('Reset device', { action: 'reset' });
        break;
    }
  };

  const handleUserAction = () => {
    if (!userName.trim()) {
      setLastMessage('❌ Please enter a name');
      return;
    }

    const userData = {
      action: 'add_user',
      user: {
        name: userName,
        status: deviceStatus,
        timestamp: new Date().toISOString()
      }
    };

    sendCommand(`Add user: ${userName}`, userData);
  };

  const handleStatusChange = (status: string) => {
    setDeviceStatus(status);
    sendCommand(`Set status to: ${status}`, { action: 'set_status', status });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Connection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Device Control
          </h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              connectedDevice ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {connectedDevice ? `Connected to ${connectedDevice.name}` : 'No device connected'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleQuickAction('turn-on')}
            disabled={!connectedDevice || isSending}
            className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>🔌</span>
            Turn On
          </button>
          
          <button
            onClick={() => handleQuickAction('turn-off')}
            disabled={!connectedDevice || isSending}
            className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>🔌</span>
            Turn Off
          </button>
          
          <button
            onClick={() => handleQuickAction('get-status')}
            disabled={!connectedDevice || isSending}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>📊</span>
            Check Status
          </button>
          
          <button
            onClick={() => handleQuickAction('reset')}
            disabled={!connectedDevice || isSending}
            className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            Reset
          </button>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          User Management
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter user name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <div className="flex gap-2">
              {['online', 'offline', 'busy', 'away'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={!connectedDevice || isSending}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    deviceStatus === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleUserAction}
            disabled={!connectedDevice || isSending || !userName.trim()}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Adding User...
              </>
            ) : (
              <>
                <span>👤</span>
                Add User
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {lastMessage && (
        <div className={`p-4 rounded-lg border ${
          lastMessage.startsWith('✅')
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <p className={`font-medium ${
            lastMessage.startsWith('✅')
              ? 'text-green-800 dark:text-green-200'
              : 'text-red-800 dark:text-red-200'
          }`}>
            {lastMessage}
          </p>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">
          💡 How to Use
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li>• <strong>Quick Actions:</strong> Control your device with simple buttons</li>
          <li>• <strong>User Management:</strong> Add users and set their status</li>
          <li>• <strong>Status Updates:</strong> Real-time feedback on all commands</li>
          <li>• <strong>Simple Interface:</strong> No complex technical commands needed</li>
        </ul>
      </div>
    </div>
  );
}

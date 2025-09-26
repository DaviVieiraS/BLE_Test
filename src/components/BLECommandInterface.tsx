'use client';

import { useState, useEffect } from 'react';
import { BLECommandManager, PayloadData, CommandResult } from '@/lib/bleCommands';
import { useBluetooth } from '@/hooks/useBluetooth';

export function BLECommandInterface() {
  const { connectedDevice, connect, disconnect } = useBluetooth();
  const [commandManager] = useState(() => new BLECommandManager());
  const [currentPayload, setCurrentPayload] = useState<PayloadData>(commandManager.getCurrentPayload());
  const [commandHistory, setCommandHistory] = useState<CommandResult[]>([]);
  const [selectedCommand, setSelectedCommand] = useState<string>('SET_ID');
  const [commandValue, setCommandValue] = useState<string>('');
  const [jsonPayload, setJsonPayload] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<CommandResult | null>(null);

  useEffect(() => {
    setCurrentPayload(commandManager.getCurrentPayload());
    setCommandHistory(commandManager.getCommandHistory());
  }, []);

  const handleCommand = async (command: string, value?: string) => {
    if (!connectedDevice) {
      setLastResult({
        success: false,
        message: 'No device connected. Please connect to a BLE device first.',
        timestamp: new Date().toISOString()
      });
      return;
    }

    setIsSending(true);
    let result: CommandResult;

    try {
      switch (command) {
        case 'SET_PAYLOAD':
          result = commandManager.setPayload(value || jsonPayload);
          break;
        case 'GET_PAYLOAD':
          result = commandManager.getPayload();
          break;
        case 'RESET_PAYLOAD':
          result = commandManager.resetPayload();
          break;
        case 'SET_ID':
          result = commandManager.setId(value || '');
          break;
        case 'SET_NAME':
          result = commandManager.setName(value || '');
          break;
        case 'SET_STATUS':
          result = commandManager.setStatus(value || '');
          break;
        case 'SET_DEVICE':
          result = commandManager.setDevice(value || '');
          break;
        case 'SET_ACTION':
          result = commandManager.setAction(value || '');
          break;
        case 'SET_TIMESTAMP':
          result = commandManager.setTimestamp(value || '');
          break;
        case 'SEND_REQUEST':
        case 'GET_REQUEST':
          // These commands would be sent to the BLE device
          result = {
            success: true,
            message: `Command sent to device: ${command}`,
            timestamp: new Date().toISOString()
          };
          break;
        default:
          result = {
            success: false,
            message: 'Unknown command',
            timestamp: new Date().toISOString()
          };
      }

      setLastResult(result);
      setCurrentPayload(commandManager.getCurrentPayload());
      setCommandHistory(commandManager.getCommandHistory());

      // Here you would send the command to the BLE device
      if (connectedDevice && (command === 'SEND_REQUEST' || command === 'GET_REQUEST')) {
        const commandString = commandManager.generateCommandString(command, value);
        console.log('Sending to BLE device:', commandString);
        // TODO: Implement actual BLE data transmission
      }

    } catch (error) {
      result = {
        success: false,
        message: error instanceof Error ? error.message : 'Command failed',
        timestamp: new Date().toISOString()
      };
      setLastResult(result);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickCommand = (command: string) => {
    setSelectedCommand(command);
    setCommandValue('');
    handleCommand(command);
  };

  const handleCustomCommand = () => {
    if (selectedCommand === 'SET_PAYLOAD') {
      handleCommand(selectedCommand, jsonPayload);
    } else {
      handleCommand(selectedCommand, commandValue);
    }
  };

  const formatJsonPayload = () => {
    setJsonPayload(JSON.stringify(currentPayload, null, 2));
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            BLE Device Control
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
        
        {!connectedDevice && (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Connect to a BLE device to send commands
            </p>
            <button
              onClick={() => {/* This would trigger device selection */}}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Connect Device
            </button>
          </div>
        )}
      </div>

      {/* Current Payload Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Payload
          </h3>
          <button
            onClick={formatJsonPayload}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition-colors duration-200"
          >
            Format JSON
          </button>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
            {JSON.stringify(currentPayload, null, 2)}
          </pre>
        </div>
      </div>

      {/* Quick Commands */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Commands
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleQuickCommand('GET_PAYLOAD')}
            disabled={!connectedDevice || isSending}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Get Payload
          </button>
          
          <button
            onClick={() => handleQuickCommand('RESET_PAYLOAD')}
            disabled={!connectedDevice || isSending}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Reset Payload
          </button>
          
          <button
            onClick={() => handleQuickCommand('SEND_REQUEST')}
            disabled={!connectedDevice || isSending}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Send Request
          </button>
          
          <button
            onClick={() => handleQuickCommand('GET_REQUEST')}
            disabled={!connectedDevice || isSending}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Get Request
          </button>
        </div>
      </div>

      {/* Individual Field Commands */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Individual Field Commands
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Command Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Command
            </label>
            <select
              value={selectedCommand}
              onChange={(e) => setSelectedCommand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="SET_ID">SET_ID</option>
              <option value="SET_NAME">SET_NAME</option>
              <option value="SET_STATUS">SET_STATUS</option>
              <option value="SET_DEVICE">SET_DEVICE</option>
              <option value="SET_ACTION">SET_ACTION</option>
              <option value="SET_TIMESTAMP">SET_TIMESTAMP</option>
              <option value="SET_PAYLOAD">SET_PAYLOAD</option>
            </select>
          </div>

          {/* Value Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Value
            </label>
            <input
              type="text"
              value={commandValue}
              onChange={(e) => setCommandValue(e.target.value)}
              placeholder="Enter value..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* JSON Payload Input for SET_PAYLOAD */}
        {selectedCommand === 'SET_PAYLOAD' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              JSON Payload
            </label>
            <textarea
              value={jsonPayload}
              onChange={(e) => setJsonPayload(e.target.value)}
              placeholder='{"action":"add","user":{"id":"123","name":"TestUser","status":"online","device":"ESP32-S3","timestamp":"2024-01-15T12:00:00Z"}}'
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        )}

        <button
          onClick={handleCustomCommand}
          disabled={!connectedDevice || isSending}
          className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isSending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Sending...
            </>
          ) : (
            'Send Command'
          )}
        </button>
      </div>

      {/* Command History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Command History
          </h3>
          <button
            onClick={() => {
              commandManager.clearHistory();
              setCommandHistory([]);
            }}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors duration-200"
          >
            Clear History
          </button>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {commandHistory.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No commands executed yet
            </p>
          ) : (
            commandHistory.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.success
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    }`}>
                      {result.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    result.success ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Last Result */}
      {lastResult && (
        <div className={`p-4 rounded-lg border ${
          lastResult.success
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              lastResult.success ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <span className="text-white text-xs font-bold">
                {lastResult.success ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex-1">
              <p className={`font-medium ${
                lastResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
              }`}>
                {lastResult.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(lastResult.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

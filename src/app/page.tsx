'use client';

import { useState } from 'react';
import { BluetoothInterface } from '@/components/BluetoothInterface';
import { BLECommandInterface } from '@/components/BLECommandInterface';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'devices' | 'commands'>('devices');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            BLE Device Controller
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Connect and control your Bluetooth devices with custom commands
          </p>
        </header>
        
        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1 border border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('devices')}
                className={`flex-1 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeTab === 'devices'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Device Management
              </button>
              <button
                onClick={() => setActiveTab('commands')}
                className={`flex-1 px-6 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeTab === 'commands'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                BLE Commands
              </button>
            </div>
          </div>
        </div>
        
        <main className="max-w-6xl mx-auto">
          {activeTab === 'devices' && <BluetoothInterface />}
          {activeTab === 'commands' && <BLECommandInterface />}
        </main>
      </div>
    </div>
  );
}

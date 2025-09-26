export interface PayloadData {
  action: string;
  user: {
    id: string;
    name: string;
    status: string;
    device: string;
    timestamp: string;
  };
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

export class BLECommandManager {
  private currentPayload: PayloadData = {
    action: 'add',
    user: {
      id: '1',
      name: 'DefaultUser',
      status: 'online',
      device: 'ESP32-S3',
      timestamp: new Date().toISOString()
    }
  };

  private commandHistory: CommandResult[] = [];

  getCurrentPayload(): PayloadData {
    return { ...this.currentPayload };
  }

  getCommandHistory(): CommandResult[] {
    return [...this.commandHistory];
  }

  private addToHistory(result: CommandResult): void {
    this.commandHistory.unshift(result);
    if (this.commandHistory.length > 50) {
      this.commandHistory = this.commandHistory.slice(0, 50);
    }
  }

  // Payload Management Commands
  setPayload(payload: string): CommandResult {
    try {
      const parsedPayload = JSON.parse(payload);
      
      // Validate payload structure
      if (!parsedPayload.action || !parsedPayload.user) {
        throw new Error('Invalid payload structure. Must contain action and user fields.');
      }

      // Validate field lengths
      if (parsedPayload.action.length > 20) {
        throw new Error('Action field too long (max 20 chars)');
      }
      if (parsedPayload.user.id && parsedPayload.user.id.length > 20) {
        throw new Error('User ID too long (max 20 chars)');
      }
      if (parsedPayload.user.name && parsedPayload.user.name.length > 50) {
        throw new Error('User name too long (max 50 chars)');
      }
      if (parsedPayload.user.status && parsedPayload.user.status.length > 20) {
        throw new Error('Status too long (max 20 chars)');
      }
      if (parsedPayload.user.device && parsedPayload.user.device.length > 30) {
        throw new Error('Device model too long (max 30 chars)');
      }
      if (parsedPayload.user.timestamp && parsedPayload.user.timestamp.length > 30) {
        throw new Error('Timestamp too long (max 30 chars)');
      }

      this.currentPayload = {
        action: parsedPayload.action || 'add',
        user: {
          id: parsedPayload.user.id || '1',
          name: parsedPayload.user.name || 'DefaultUser',
          status: parsedPayload.user.status || 'online',
          device: parsedPayload.user.device || 'ESP32-S3',
          timestamp: parsedPayload.user.timestamp || new Date().toISOString()
        }
      };

      const result: CommandResult = {
        success: true,
        message: 'Payload updated successfully',
        data: this.currentPayload,
        timestamp: new Date().toISOString()
      };

      this.addToHistory(result);
      return result;
    } catch (error) {
      const result: CommandResult = {
        success: false,
        message: error instanceof Error ? error.message : 'Invalid JSON payload',
        timestamp: new Date().toISOString()
      };
      this.addToHistory(result);
      return result;
    }
  }

  getPayload(): CommandResult {
    const result: CommandResult = {
      success: true,
      message: 'Current payload retrieved',
      data: this.currentPayload,
      timestamp: new Date().toISOString()
    };
    this.addToHistory(result);
    return result;
  }

  resetPayload(): CommandResult {
    this.currentPayload = {
      action: 'add',
      user: {
        id: '1',
        name: 'DefaultUser',
        status: 'online',
        device: 'ESP32-S3',
        timestamp: new Date().toISOString()
      }
    };

    const result: CommandResult = {
      success: true,
      message: 'Payload reset to default',
      data: this.currentPayload,
      timestamp: new Date().toISOString()
    };
    this.addToHistory(result);
    return result;
  }

  // Individual Field Commands
  setId(id: string): CommandResult {
    if (id.length > 20) {
      const result: CommandResult = {
        success: false,
        message: 'User ID too long (max 20 chars)',
        timestamp: new Date().toISOString()
      };
      this.addToHistory(result);
      return result;
    }

    this.currentPayload.user.id = id;
    const result: CommandResult = {
      success: true,
      message: `User ID set to: ${id}`,
      data: this.currentPayload,
      timestamp: new Date().toISOString()
    };
    this.addToHistory(result);
    return result;
  }

  setName(name: string): CommandResult {
    if (name.length > 50) {
      const result: CommandResult = {
        success: false,
        message: 'User name too long (max 50 chars)',
        timestamp: new Date().toISOString()
      };
      this.addToHistory(result);
      return result;
    }

    this.currentPayload.user.name = name;
    const result: CommandResult = {
      success: true,
      message: `User name set to: ${name}`,
      data: this.currentPayload,
      timestamp: new Date().toISOString()
    };
    this.addToHistory(result);
    return result;
  }

  setStatus(status: string): CommandResult {
    if (status.length > 20) {
      const result: CommandResult = {
        success: false,
        message: 'Status too long (max 20 chars)',
        timestamp: new Date().toISOString()
      };
      this.addToHistory(result);
      return result;
    }

    this.currentPayload.user.status = status;
    const result: CommandResult = {
      success: true,
      message: `Status set to: ${status}`,
      data: this.currentPayload,
      timestamp: new Date().toISOString()
    };
    this.addToHistory(result);
    return result;
  }

  setDevice(device: string): CommandResult {
    if (device.length > 30) {
      const result: CommandResult = {
        success: false,
        message: 'Device model too long (max 30 chars)',
        timestamp: new Date().toISOString()
      };
      this.addToHistory(result);
      return result;
    }

    this.currentPayload.user.device = device;
    const result: CommandResult = {
      success: true,
      message: `Device model set to: ${device}`,
      data: this.currentPayload,
      timestamp: new Date().toISOString()
    };
    this.addToHistory(result);
    return result;
  }

  setAction(action: string): CommandResult {
    if (action.length > 20) {
      const result: CommandResult = {
        success: false,
        message: 'Action too long (max 20 chars)',
        timestamp: new Date().toISOString()
      };
      this.addToHistory(result);
      return result;
    }

    this.currentPayload.action = action;
    const result: CommandResult = {
      success: true,
      message: `Action set to: ${action}`,
      data: this.currentPayload,
      timestamp: new Date().toISOString()
    };
    this.addToHistory(result);
    return result;
  }

  setTimestamp(timestamp: string): CommandResult {
    if (timestamp.length > 30) {
      const result: CommandResult = {
        success: false,
        message: 'Timestamp too long (max 30 chars)',
        timestamp: new Date().toISOString()
      };
      this.addToHistory(result);
      return result;
    }

    this.currentPayload.user.timestamp = timestamp;
    const result: CommandResult = {
      success: true,
      message: `Timestamp set to: ${timestamp}`,
      data: this.currentPayload,
      timestamp: new Date().toISOString()
    };
    this.addToHistory(result);
    return result;
  }

  // Generate command strings for BLE transmission
  generateCommandString(command: string, value?: string): string {
    switch (command) {
      case 'SET_PAYLOAD':
        return `SET_PAYLOAD:${value}`;
      case 'GET_PAYLOAD':
        return 'GET_PAYLOAD';
      case 'RESET_PAYLOAD':
        return 'RESET_PAYLOAD';
      case 'SET_ID':
        return `SET_ID:${value}`;
      case 'SET_NAME':
        return `SET_NAME:${value}`;
      case 'SET_STATUS':
        return `SET_STATUS:${value}`;
      case 'SET_DEVICE':
        return `SET_DEVICE:${value}`;
      case 'SET_ACTION':
        return `SET_ACTION:${value}`;
      case 'SET_TIMESTAMP':
        return `SET_TIMESTAMP:${value}`;
      case 'SEND_REQUEST':
        return 'SEND_REQUEST';
      case 'GET_REQUEST':
        return 'GET_REQUEST';
      default:
        return command;
    }
  }

  // Clear command history
  clearHistory(): void {
    this.commandHistory = [];
  }
}

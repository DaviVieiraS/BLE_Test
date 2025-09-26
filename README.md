# Bluetooth Device Manager

A modern web application built with Next.js that allows you to connect and manage Bluetooth devices from both smartphones and computers. This app uses the Web Bluetooth API to provide a seamless cross-platform experience.

## Features

- 🔍 **Device Discovery**: Scan for nearby Bluetooth devices
- 🔗 **Easy Connection**: Connect and disconnect from devices with one click
- 🔋 **Battery Monitoring**: Check battery levels of connected devices
- 📱 **Cross-Platform**: Works on smartphones, tablets, and computers
- 🎨 **Modern UI**: Beautiful, responsive interface with dark mode support
- ⚡ **Real-time Status**: Live connection status and device information

## Browser Compatibility

The Web Bluetooth API is supported in:
- Chrome 56+ (Desktop & Android)
- Edge 79+ (Desktop)
- Opera 43+ (Desktop & Android)
- Samsung Internet 6.0+

**Note**: This app requires HTTPS to work properly due to Web Bluetooth API security requirements.

## Getting Started

### Prerequisites

- Node.js 18+ 
- A compatible browser (see above)
- HTTPS connection (required for Bluetooth API)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bluetooth-web-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [https://localhost:3000](https://localhost:3000) in a compatible browser

### Production Deployment

#### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

The app is configured with proper headers and HTTPS support for Vercel deployment.

#### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Usage

1. **Check Compatibility**: The app will automatically detect if your browser supports Bluetooth
2. **Scan for Devices**: Click "Scan for Devices" to discover nearby Bluetooth devices
3. **Connect**: Click "Connect" on any discovered device to establish a connection
4. **Monitor**: View connection status and battery levels of connected devices
5. **Manage**: Disconnect or reconnect devices as needed

## Technical Details

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Bluetooth API**: Web Bluetooth API with proper error handling
- **State Management**: Custom React hooks
- **Responsive Design**: Mobile-first approach

## Security

- Requires HTTPS for Bluetooth API access
- Proper permission policies configured
- Secure headers for production deployment
- No sensitive data stored locally

## Troubleshooting

### Bluetooth Not Working
- Ensure you're using a compatible browser
- Check that the site is served over HTTPS
- Verify Bluetooth is enabled on your device
- Try refreshing the page

### Device Not Found
- Make sure the Bluetooth device is in pairing mode
- Check that the device is within range
- Try scanning multiple times
- Some devices may require specific services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

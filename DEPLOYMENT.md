# Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial Bluetooth Web App"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Deploy automatically

## Manual Deployment

### Build and Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Test production build
npm start
```

### Deploy to Other Platforms

#### Netlify
1. Build the project: `npm run build`
2. Deploy the `.next` folder
3. Configure redirects for SPA routing

#### Railway
1. Connect your GitHub repository
2. Railway will automatically detect Next.js
3. Deploy with one click

#### Self-hosted
1. Build: `npm run build`
2. Start: `npm start`
3. Configure reverse proxy for HTTPS

## Important Notes

- **HTTPS Required**: The Web Bluetooth API only works over HTTPS
- **Browser Compatibility**: Chrome, Edge, Opera, Samsung Internet
- **Mobile Support**: Works on Android devices with compatible browsers
- **Desktop Support**: Works on Windows, macOS, and Linux

## Environment Variables

No environment variables are required for basic functionality.

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run lint`
- Verify Next.js version compatibility

### Runtime Errors
- Ensure HTTPS is enabled
- Check browser compatibility
- Verify Bluetooth permissions

### Deployment Issues
- Check Vercel build logs
- Ensure all files are committed
- Verify `vercel.json` configuration

# Ultimate Blueprint Pilot - Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository connected to Vercel
- Google Cloud Platform project for Drive API

### 1. Vercel Setup

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project directory
   vercel
   ```

2. **Environment Variables**
   Set these in Vercel dashboard or via CLI:
   ```bash
   vercel env add NEXT_PUBLIC_GOOGLE_CLIENT_ID
   vercel env add NEXT_PUBLIC_GOOGLE_API_KEY
   ```

### 2. Google Drive API Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable Google Drive API

2. **Configure OAuth 2.0**
   - Go to "APIs & Services" > "Credentials"
   - Create OAuth 2.0 Client ID
   - Set authorized origins:
     - `https://your-app.vercel.app`
     - `http://localhost:3000` (for development)
   - Set authorized redirect URIs:
     - `https://your-app.vercel.app`
     - `http://localhost:3000`

3. **Get API Keys**
   - Copy Client ID → `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - Create API Key → `NEXT_PUBLIC_GOOGLE_API_KEY`

### 3. Build & Deploy

```bash
# Build locally to test
npm run build

# Deploy to Vercel
vercel --prod
```

## Environment Variables

### Required for Production
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key
```

### Development (.env.local)
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key
```

## Google Drive Integration

### Features
- **OAuth Authentication**: Secure commander login
- **Blueprint Persistence**: Save/load blueprint specs
- **Folder Organization**: `/Blueprints/` folder structure
- **Commander Approval**: Required for all file operations
- **Version Control**: Timestamped file naming

### File Structure
```
Google Drive/
└── Blueprints/
    ├── final_blueprint_v1.0.0_20250103.yaml
    ├── final_blueprint_v1.1.0_20250104.yaml
    └── ...
```

### Security
- OAuth 2.0 authentication
- Commander approval workflow
- File-level permissions
- Secure API communication

## Deployment Checklist

- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Google Cloud project configured
- [ ] OAuth 2.0 credentials created
- [ ] Google Drive API enabled
- [ ] Build successful locally
- [ ] Deployed to Vercel
- [ ] Google Drive integration tested
- [ ] Commander approval workflow tested

## Troubleshooting

### Common Issues

1. **Google API Errors**
   - Check API key and client ID
   - Verify OAuth origins and redirects
   - Ensure Drive API is enabled

2. **Vercel Build Failures**
   - Check environment variables
   - Verify Next.js configuration
   - Review build logs

3. **Authentication Issues**
   - Clear browser cache
   - Check OAuth configuration
   - Verify domain settings

### Support
- Vercel: [vercel.com/support](https://vercel.com/support)
- Google Cloud: [cloud.google.com/support](https://cloud.google.com/support)
- Project Issues: [GitHub Issues](https://github.com/djb258/ultimate-blueprint-pilot/issues) 
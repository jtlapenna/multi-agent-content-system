# Approval Hub Deployment Guide

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Personal Access Token**: Create with `repo` and `workflow` scopes
3. **Node.js 18+**: Install from [nodejs.org](https://nodejs.org)
4. **Wrangler CLI**: Install globally with `npm install -g wrangler`

## Setup Steps

### 1. Install Dependencies

```bash
# Install project dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure GitHub Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
4. Copy the token

### 3. Configure Cloudflare

```bash
# Login to Cloudflare
wrangler login

# Set environment variables
wrangler secret put GITHUB_TOKEN
# Enter your GitHub token when prompted
```

### 4. Update Configuration

Edit `wrangler.toml` and update the domain routes:

```toml
[env.production]
name = "approval-hub"
route = "your-actual-domain.com/*"

[env.staging]
name = "approval-hub-staging"
route = "staging.your-actual-domain.com/*"
```

## Development

### Local Development

```bash
# Start development server
npm run dev

# This will start both frontend and functions locally
# Frontend: http://localhost:3000
# Functions: http://localhost:8788
```

### Testing

1. **Health Check**: Visit `http://localhost:8788/api/health`
2. **List Posts**: Visit `http://localhost:8788/api/posts`
3. **Frontend**: Visit `http://localhost:3000`

## Deployment

### Staging Deployment

```bash
# Deploy to staging environment
npm run deploy:staging
```

### Production Deployment

```bash
# Build frontend
npm run build

# Deploy to production
npm run deploy
```

## Environment Variables

Set these in your Cloudflare Pages dashboard:

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_TOKEN` | GitHub Personal Access Token | Yes |
| `REPO_OWNER` | GitHub username (default: jtlapenna) | No |
| `REPO_NAME` | Repository name (default: bright-gift) | No |

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Ensure you're using Node.js 18+
   - Run `npm install` in both root and frontend directories

2. **GitHub API rate limiting**
   - Check your token has correct scopes
   - Verify the repository exists and is accessible

3. **CORS errors**
   - Ensure frontend is served from the same domain as functions
   - Check Cloudflare Pages settings

4. **Functions not found**
   - Verify `functions/` directory structure
   - Check `wrangler.toml` configuration

### Debug Mode

```bash
# Run with debug logging
DEBUG=* npm run dev
```

## Monitoring

### Health Checks

- **Endpoint**: `/api/health`
- **Expected Response**: `{"status":"ok","message":"Approval Hub API is running"}`

### Logs

View logs in Cloudflare dashboard:
1. Go to Workers & Pages
2. Select your project
3. Click "Logs" tab

## Security Considerations

1. **GitHub Token**: Store securely, rotate regularly
2. **CORS**: Configure for your specific domain
3. **Rate Limiting**: Monitor GitHub API usage
4. **Input Validation**: All user inputs are validated

## Support

For issues:
1. Check Cloudflare Pages logs
2. Verify GitHub token permissions
3. Test API endpoints directly
4. Review browser console for frontend errors 
# Approval Hub - Content Approval Interface

A web-based interface for reviewing and approving blog content before publication.

## Architecture

- **Frontend**: React (Vite) - Modern, responsive UI
- **Backend**: Cloudflare Pages Functions - Serverless API
- **Data Source**: GitHub API - Direct integration with bright-gift repository
- **Hosting**: Cloudflare Pages (frontend + backend functions)

## Features

### MVP (Current)
- ✅ List pending posts from preview branch
- ✅ View post details with frontmatter parsing
- ✅ Approve posts (creates PR to main branch)
- ✅ Reject posts (deletes from preview, archives to rejected-posts)
- ✅ Health check endpoint

### Planned
- Authentication & user management
- Approval history & statistics
- Multi-site support
- Real-time notifications
- Bulk operations

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/posts` | List pending posts |
| GET | `/api/posts/:id` | Get post details |
| POST | `/api/posts/:id/approve` | Approve post |
| POST | `/api/posts/:id/reject` | Reject post |

## Setup & Deployment

### 1. Environment Variables

Set these in your Cloudflare Pages project:

```bash
GITHUB_TOKEN=your_github_personal_access_token
```

**GitHub Token Requirements:**
- `repo` scope (full repository access)
- `workflow` scope (for future CI/CD integration)

### 2. Local Development

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Run locally
wrangler pages dev --compatibility-date=2024-01-01

# Deploy
wrangler pages deploy approval-hub
```

### 3. Repository Structure

```
approval-hub/
├── functions/
│   └── api/
│       ├── health.js
│       ├── posts.js
│       └── posts/
│           ├── [id].js
│           ├── [id]/
│           │   ├── approve.js
│           │   └── reject.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PostList.jsx
│   │   │   └── PostDetail.jsx
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Workflow

1. **Content Generation**: Cursor Background Agents create posts in `preview` branch
2. **Review**: Content appears in Approval Hub interface
3. **Approval**: Creates PR from preview → main branch
4. **Publication**: PR merge triggers deployment to bright-gift.com

## Security

- GitHub token stored as environment variable
- CORS configured for Cloudflare Pages domain
- Input validation on all endpoints
- Error handling with appropriate HTTP status codes

## Monitoring

- Health check endpoint for uptime monitoring
- GitHub API rate limiting awareness
- Error logging via Cloudflare Workers logs

## Future Enhancements

- Database integration for approval history
- Webhook support for real-time updates
- Multi-user authentication
- Advanced filtering and search
- Bulk approval/rejection operations 
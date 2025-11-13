# BETHANZ Leaderboard - Frontend

This is the frontend application built with Next.js 14 and React 18.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your credentials

# Start development server
npm run dev
```

Visit http://localhost:3000

## Environment Variables

Required variables in `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # React components
├── hooks/           # Custom hooks
├── lib/             # Utilities
└── types/           # TypeScript definitions
```

## Key Features

- ✅ Real-time WebSocket updates
- ✅ Discord OAuth authentication
- ✅ Admin panel for settings management
- ✅ Responsive design
- ✅ Live countdown timer
- ✅ Historical leaderboard data

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Cloudflare Pages

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.


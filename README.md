# Rently.sg

Your digital gathering space for seamless collaboration.

Rently is a virtual collaboration platform built for teams in Singapore and beyond. Create customizable virtual spaces where your team can meet, collaborate, and connect naturally through proximity-based video chat.

## Key Features

- **Customizable Virtual Spaces** - Design your office with custom tilesets and layouts
- **Proximity Video Chat** - Audio and video automatically adjust based on distance
- **Private Meeting Areas** - Create dedicated zones for focused discussions
- **Real-time Multiplayer** - See teammates move and interact in real-time
- **Multiple Map Templates** - Choose from starter maps, procedurally generated layouts, or Rently-branded offices
- **Intuitive Movement** - Simple tile-based navigation with mouse wheel zoom

## Technology Stack

Built with modern web technologies for a seamless experience:
- **Frontend**: Next.js 15, TypeScript, TailwindCSS, Pixi.js
- **Backend**: Node.js, Socket.io
- **Database & Auth**: Supabase
- **Video Chat**: Agora
- **Styling**: Custom Rently design system with brand colors

## Credits

This project is a fork of [gather-clone](https://github.com/trevorwrightdev/gather-clone) by Trevor Wright, which was itself inspired by Gather.town. We've customized it with Rently branding, enhanced features, and Singapore-focused improvements. 

## How to Install

First, clone the repo.
```bash
git clone https://github.com/tarikstafford/gather-rently.git
cd gather-rently
```

Install client dependencies.
```bash
cd frontend
npm install
```

Install server dependencies.
```bash
cd backend
npm install
```

The project requires both Supabase and Agora - you'll need to create projects in both platforms.

Create a .env file in the `backend` directory with the following variables:
```
FRONTEND_URL=
SUPABASE_URL=
SERVICE_ROLE=
```

Create a .env.local file in the `frontend` directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_BACKEND_URL=
SERVICE_ROLE=
NEXT_PUBLIC_AGORA_APP_ID=
APP_CERTIFICATE=
```

Lastly, run `npm run dev` in both the `frontend` and `backend` directories.

# MathWhiteboard

A collaborative whiteboard application for online math tutoring with real-time collaboration, LaTeX support, and function graphing.

## Features

- 🎨 **Real-time Collaborative Drawing** - Multiple users can draw simultaneously
- 📐 **Math-Optimized Tools** - LaTeX equation rendering, function graphing, geometric shapes
- 👥 **User Roles** - Teacher and student roles with permission management
- 💬 **Built-in Chat** - Real-time messaging during sessions
- 📹 **Video Calling** - Peer-to-peer video/audio communication
- 📊 **Export Options** - Save whiteboards as PNG or PDF
- 🔒 **Secure Sessions** - Password-protected sessions with authentication

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Canvas**: Fabric.js for drawing functionality
- **Math Rendering**: KaTeX for LaTeX equations
- **Graphing**: Chart.js with math.js for function evaluation
- **Real-time**: Supabase Realtime for collaboration
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Video**: PeerJS for WebRTC
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Vercel account (for deployment)

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mistrzwujo098/MathWhiteboard.git
cd MathWhiteboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Supabase Setup

The database schema is automatically created when you run the migrations in the Supabase project.

## Usage

1. **Create Account**: Sign up with email or Google
2. **Create Session**: Teachers can create new whiteboard sessions
3. **Share Link**: Copy and share the session link with students
4. **Collaborate**: Draw, add equations, chat, and video call in real-time
5. **Export**: Save your work as PNG or PDF

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
# MathWhiteboard

A comprehensive mathematical whiteboard solution with both a Next.js application and a reusable TypeScript library.

## 📦 Project Structure

This repository contains two main components:

### 1. **MathWhiteboard App** (Root)
A full-featured collaborative whiteboard application built with Next.js 14, featuring:
- 🎨 Real-time collaborative drawing
- 📐 Math-optimized tools (LaTeX, graphing)
- 👥 User roles and permissions
- 💬 Built-in chat
- 📹 Video calling
- 🔒 Secure sessions with authentication

### 2. **MathWhiteboard Core Library** (`/lib/math-whiteboard`)
A TypeScript library providing the core whiteboard functionality:
- 🎯 Full TypeScript support with extended Fabric.js types
- 📐 Mathematical equation support
- 🎨 Drawing tools with customization
- 💾 Serialization capabilities
- ⚛️ React component integration

## 🚀 Getting Started

### Using the Next.js Application

```bash
# Clone the repository
git clone https://github.com/mistrzwujo098/MathWhiteboard.git
cd MathWhiteboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### Using the Core Library

The core library can be used independently in any TypeScript/JavaScript project:

```bash
# Navigate to library
cd lib/math-whiteboard

# Install dependencies
npm install

# Build the library
npm run build
```

Example usage:
```typescript
import { MathWhiteboard } from '@mathwhiteboard/core';

const whiteboard = new MathWhiteboard(canvasElement);
whiteboard.addText('Hello Math!', { left: 100, top: 100 });
```

## 🛠 Tech Stack

### Application
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Canvas**: Fabric.js
- **Math Rendering**: KaTeX
- **Real-time**: Supabase Realtime
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Video**: PeerJS for WebRTC

### Core Library
- **Language**: TypeScript
- **Canvas**: Fabric.js
- **Framework**: React (optional)
- **Build**: TypeScript Compiler

## 📝 Documentation

- [Application Documentation](./docs/app.md)
- [Core Library Documentation](./lib/math-whiteboard/README.md)
- [API Reference](./docs/api.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Fabric.js](http://fabricjs.com/) for canvas functionality
- Math rendering powered by [KaTeX](https://katex.org/)
- Real-time features by [Supabase](https://supabase.com/)
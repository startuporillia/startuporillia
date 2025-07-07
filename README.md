# Startup Orillia Website

## Project Overview

This is the official website for Startup Orillia, a vibrant community for entrepreneurs, tech professionals, and innovators in Orillia, Ontario.

**Live Site**: https://startuporillia.ca

## Development

### Prerequisites

- **Bun** (recommended) - [install Bun](https://bun.sh/docs/installation)
- **Node.js v16+** (alternative) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

> **Note**: This project uses modern JavaScript features that require Node.js v16 or higher. Bun is recommended for better performance and compatibility.

### Getting Started

```sh
# Clone the repository
git clone https://github.com/yourusername/startuporillia.git

# Navigate to the project directory
cd startuporillia

# Install dependencies (using Bun)
bun install

# Start the development server
bun run dev
```

**Alternative with Node.js:**

```sh
# Install dependencies
npm install

# Start the development server
npm run dev
```

**If you encounter Node.js version issues, use:**

```sh
bunx --bun vite
```

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint

### Development Server

Once started, the development server will be available at:

- **http://localhost:5173** (default)
- **http://localhost:8080** (if 5173 is busy)

The server includes:

- ✅ Hot reload on file changes
- ✅ TypeScript compilation
- ✅ Tailwind CSS processing
- ✅ Error overlay for debugging

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Bun (package manager)

## Deployment

The site is deployed using GitHub Pages. To deploy:

```sh
bun run build
bun run deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

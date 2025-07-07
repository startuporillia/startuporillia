# Startup Orillia Website

## Project Overview

This is the official website for Startup Orillia, a vibrant community for entrepreneurs, tech professionals, and innovators in Orillia, Ontario.

**Live Site**: https://startuporillia.ca

## Development

### Prerequisites

- **Node.js v18+** (recommended) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm v8+** (comes with Node.js)

> **Note**: This project uses modern JavaScript features that require Node.js v18 or higher. We recommend using nvm to manage Node.js versions.

### Getting Started

```sh
# Clone the repository
git clone https://github.com/yourusername/startuporillia.git

# Navigate to the project directory
cd startuporillia

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

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
- npm (package manager)

## Deployment

The site is deployed using GitHub Pages. To deploy:

```sh
npm run build
npm run deploy
```

> **Note**: With Node.js v20+, the build process should work without any version compatibility warnings.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

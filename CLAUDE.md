# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FocusPulse is a Bun-based TypeScript monorepo with four packages. It uses Bun's native workspace support for fast development and minimal configuration.

## Common Development Commands

### Essential Commands
```bash
# Install all dependencies (run from root)
bun install

# Run all packages in development mode
bun run dev

# Build all packages for production
bun run build

# Run tests (currently only in utils package)
bun test

# Run a specific package
cd packages/app && bun run dev
cd packages/ui && bun run dev
cd packages/utils && bun run dev
cd packages/web && bun run dev  # Next.js web application

# Build a specific package
cd packages/app && bun run build
cd packages/web && bun run build  # Next.js production build
```

### Working with Workspaces
```bash
# Run a command in all packages
bun run --filter '*' <command>

# Run a command in a specific package from root
bun run --filter @focuspulse/app dev
bun run --filter @focuspulse/ui build
bun run --filter @focuspulse/utils test
bun run --filter @focuspulse/web dev  # Next.js dev server
```

## Architecture

### Package Structure and Dependencies

The monorepo follows a layered architecture with clear dependency flow:

```
@focuspulse/web (Next.js Web Application)
    └── Independent Next.js app (can optionally depend on other packages)

@focuspulse/app (Application Layer)
    ├── depends on → @focuspulse/ui
    └── depends on → @focuspulse/utils

@focuspulse/ui (UI Components Layer)
    └── depends on → @focuspulse/utils

@focuspulse/utils (Base Utilities Layer)
    └── No internal dependencies
```

### Package Responsibilities

**@focuspulse/web** (`packages/web/app/page.tsx`)
- Next.js 16 web application with App Router
- Uses React 19 and Tailwind CSS 4
- Independent web frontend (does not currently depend on other workspace packages)
- Different build system: Uses Next.js tooling instead of Bun build
- Has its own TypeScript configuration optimized for Next.js

**@focuspulse/app** (`packages/app/index.ts`)
- Entry point for the application
- Orchestrates UI components and utilities
- Contains the main async function that demonstrates all features
- Imports from both ui and utils packages using workspace references

**@focuspulse/ui** (`packages/ui/index.ts`)
- Exports reusable UI component functions: `Button`, `Card`, `Alert`
- Each component returns HTML string templates
- Uses utils package for text formatting (capitalize function)

**@focuspulse/utils** (`packages/utils/index.ts`)
- Provides core utility functions used across the codebase
- Exports: `formatDate`, `capitalize`, `delay`
- Foundation layer with no dependencies on other packages

### TypeScript Configuration

The project uses TypeScript configurations at two levels:

**Root tsconfig.json** (for Bun packages: app, ui, utils)
- **Module Resolution**: Bundler mode with ESNext modules
- **Path Aliases**: `@focuspulse/*` maps to `./packages/*/index.ts`
- **Strict Mode**: Enabled for type safety
- **Target**: ES2020 with JSX support (react-jsx)
- **Bun Types**: Configured for Bun runtime compatibility

**@focuspulse/web tsconfig.json** (Next.js-specific)
- **Module Resolution**: Bundler mode with ESNext
- **Path Aliases**: `@/*` maps to local files within the web package
- **Next.js Plugin**: Integrated for optimal Next.js development
- **Target**: ES2017 with DOM libraries

### Workspace Configuration

All packages are linked through Bun workspaces using `workspace:*` protocol in package.json dependencies. This ensures:
- Automatic linking of local packages
- No need for manual symlinks
- Fast dependency resolution
- Consistent versioning across packages

## Important Technical Details

1. **Runtime**:
   - Bun packages (app, ui, utils): Use Bun runtime with Bun-specific APIs
   - Web package: Uses Next.js runtime (Node.js-based)
2. **Module Type**: All packages use ES modules (`"type": "module"`)
3. **Build Output**:
   - Bun packages: Build to `./dist` directory using `bun build`
   - Web package: Builds to `.next` directory using `next build`
4. **Entry Points**:
   - Bun packages: `index.ts` as main entry point
   - Web package: Next.js App Router structure (`app/page.tsx`)
5. **Import Extensions**: TypeScript allows `.ts` extensions in imports (`allowImportingTsExtensions: true`)

## Dual Build System

The monorepo supports two different build systems:
- **Bun Build**: For @focuspulse/app, @focuspulse/ui, and @focuspulse/utils
- **Next.js Build**: For @focuspulse/web (includes React Server Components, bundling, optimization)
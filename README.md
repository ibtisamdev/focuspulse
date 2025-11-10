# FocusPulse - Bun Workspace

A minimal Bun workspace setup with TypeScript support.

## Structure

```
focuspulse/
├── packages/
│   ├── app/         # Main application
│   ├── ui/          # UI components
│   └── utils/       # Shared utilities
├── package.json     # Root workspace configuration
├── tsconfig.json    # TypeScript configuration
└── bun.lockb       # Bun lockfile
```

## Features

- **Minimal Configuration**: Simple workspace setup with only essential configuration
- **TypeScript Support**: Full TypeScript support across all packages
- **Workspace Dependencies**: Packages can reference each other using `workspace:*`
- **Fast Installation**: Uses Bun's native workspace support for fast dependency resolution

## Quick Start

```bash
# Install dependencies
bun install

# Run the app
cd packages/app
bun run dev

# Or from root, run all dev scripts
bun run dev

# Build all packages
bun run build

# Run tests
bun test
```

## Workspace Configuration

The workspace is configured in the root `package.json`:

```json
{
  "workspaces": ["packages/*"]
}
```

Each package can reference other workspace packages using:

```json
{
  "dependencies": {
    "@focuspulse/utils": "workspace:*"
  }
}
```

## Package Dependencies

- **@focuspulse/app**: Main application (depends on ui and utils)
- **@focuspulse/ui**: UI components (depends on utils)
- **@focuspulse/utils**: Shared utilities (no internal dependencies)

## Development

Each package has its own scripts:
- `dev`: Run the package in development mode
- `build`: Build the package for production
- `test`: Run tests (where applicable)
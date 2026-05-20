# homelab-wol-desktop

Wake-on-LAN (WoL) desktop application built with Tauri, React, and TypeScript. Easily manage your devices and send WoL magic packets to wake them remotely.

## Features

- 📱 **Device Management**: Add, edit, and delete devices with MAC addresses
- 🌙 **Wake-on-LAN**: Send magic packets to wake devices on your network
- 💾 **Persistent Storage**: Devices are automatically saved and restored
- 🔒 **Type-Safe**: Full TypeScript and Rust error handling
- ⚡ **Fast & Lightweight**: Minimal dependencies, optimized Vite build
- ✅ **Well-Tested**: 14+ tests with 80%+ coverage
- 🎨 **Clean UI**: Intuitive React interface with inline editing

## System Requirements

- **Node.js** 20+ (or 18.18+ for LTS)
- **Rust** 1.70+ (for building)
- **pnpm** 10+ (or npm/yarn)
- **macOS 11+**, **Ubuntu 20.04+**, or **Windows 10+**

## Installation

### Using Nix (Recommended for Development)

```bash
nix develop  # Enter dev shell with all dependencies
pnpm install
```

### Manual Setup

```bash
# Install dependencies
pnpm install

# For Rust/Tauri build on Linux, also install:
sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

## Development

### Start Development Server

```bash
pnpm dev              # Start Vite dev server
pnpm tauri:dev       # Start Tauri app with live reload
```

### Building

```bash
# Frontend only
pnpm build

# Full Tauri app
pnpm tauri build     # Builds for current platform
```

## Quality Assurance

### Linting & Formatting

```bash
pnpm lint            # Run ESLint
pnpm format          # Auto-format with Prettier
pnpm format:check    # Check formatting
```

### Testing

```bash
pnpm test              # Run tests in watch mode
pnpm test -- --run    # Single test run (used in CI)
pnpm test:ui          # Interactive test UI
pnpm test:coverage    # Generate coverage report
```

### Rust Backend

```bash
cargo test           # Run Rust tests
cargo clippy         # Lint Rust code
```

## Project Structure

```
├── src/                    # React frontend
│   ├── App.tsx            # Main component
│   ├── App.spec.tsx       # Component tests
│   ├── App.css            # Styles
│   └── test/
│       └── setup.ts       # Test configuration & mocks
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── lib.rs        # Tauri commands
│   │   ├── main.rs       # App entry point
│   │   └── errors.rs     # Error types
│   └── Cargo.toml
├── vite.config.ts         # Vite build configuration
├── vitest.config.ts       # Test runner configuration
├── tsconfig.json          # TypeScript configuration
└── flake.nix             # Nix development environment
```

## API Reference

### Tauri Commands

All commands are invoked via `@tauri-apps/api` core:

#### `save_devices`
Save device list to persistent storage.
```typescript
await invoke('save_devices', { devices: Device[] })
```

#### `load_devices`
Load device list from persistent storage.
```typescript
const devices = await invoke<Device[]>('load_devices')
```

#### `send_magic_packet`
Send a WoL magic packet to specified MAC address.
```typescript
await invoke('send_magic_packet', { mac: string })
```

#### `update_device`
Update device by index.
```typescript
await invoke('update_device', { index: number, name: string, mac: string })
```

#### `delete_device`
Delete device by index.
```typescript
await invoke('delete_device', { index: number })
```

### Device Interface

```typescript
interface Device {
  name: string;      // Device name (required)
  mac: string;       // MAC address (format: XX:XX:XX:XX:XX:XX)
}
```

### Error Handling

All commands return errors as strings. Frontend should wrap invokes in try/catch:

```typescript
try {
  await invoke('send_magic_packet', { mac })
} catch (error) {
  console.error('Failed to wake device:', error)
}
```

## Data Storage

Devices are stored in your system's application data directory:
- **macOS**: `~/Library/Application Support/com.homelab-wol.desktop/devices.json`
- **Linux**: `~/.config/com.homelab-wol.desktop/devices.json`
- **Windows**: `%APPDATA%/com.homelab-wol.desktop/devices.json`

## CI/CD Pipeline

GitHub Actions automatically:
- Checks code formatting (ESLint, Prettier, Cargo fmt)
- Runs clippy and Rust tests
- Runs frontend tests with coverage reporting
- Builds Linux AppImage

## Troubleshooting

### Tests fail with "Cannot find module"
- Run `pnpm install` to ensure all dependencies are installed
- Clear Vitest cache: `rm -rf .vitest`

### Tauri dev build fails
- Ensure Rust toolchain is installed: `rustup update`
- On Linux, install webkit dependencies (see Installation)

### MAC address validation fails
- Format must be `XX:XX:XX:XX:XX:XX` (uppercase hex with colons)
- Example: `00:1A:2B:3C:4D:5E`

## IDE Setup

### VS Code (Recommended)

Install extensions:
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## License

MIT

## Contributing

Contributions welcome! Please:
1. Follow the code style (ESLint/Prettier)
2. Add tests for new features
3. Ensure all CI checks pass
4. Update README if needed

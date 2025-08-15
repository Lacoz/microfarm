# MicroFarm - Isometric Farming Simulator

A modern TypeScript-based isometric farming simulation game with a monorepo architecture featuring separate backend and frontend packages.

## 🏗️ Architecture

This project is structured as an npm monorepo with the following packages:

- **`@microfarm/shared`**: Shared types, utilities, and constants
- **`@microfarm/backend`**: Express.js API server with game logic
- **`@microfarm/frontend`**: Vite-based frontend with TypeScript and Canvas rendering

## 🚀 Features

### Character Customization
- **Name**: Choose your farmer's name
- **Body Type**: Slim, Average, or Sturdy
- **Hair Style**: Short, Long, Curly, or Bald
- **Hair Color**: Brown, Black, Blonde, Red, or Teal
- **Skin Tone**: Various skin tone options
- **Live Preview**: See your character as you customize

### Farming Mechanics
- **Isometric View**: Beautiful 2.5D perspective rendering
- **Tool System**: 
  - 🪓 Hoe: Till the soil
  - 💧 Water: Water tilled soil
  - 🌱 Plant: Plant seeds in watered soil
  - ✂️ Harvest: Collect mature crops
- **Resource Management**: 
  - Money: Earn by selling crops
  - Energy: Limited energy for actions
  - Seeds: Plant to grow crops
- **Real-time Updates**: Crops grow automatically over time

### Technical Features
- **TypeScript**: Full type safety across all packages
- **Monorepo**: Shared code and types between frontend and backend
- **REST API**: Clean separation between client and server
- **Real-time**: Live crop growth and game state updates
- **Responsive**: Works on desktop and mobile devices

## 🛠️ Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd microfarm
   npm install
   ```

2. **Build shared package**:
   ```bash
   npm run build:shared
   ```

3. **Start development servers**:
   ```bash
   # Start both backend and frontend
   npm run dev
   
   # Or start individually
   npm run dev:backend  # Backend on http://localhost:3001
   npm run dev:frontend # Frontend on http://localhost:3000
   ```

### Available Scripts

```bash
# Development
npm run dev              # Start both backend and frontend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only

# Building
npm run build            # Build all packages
npm run build:backend    # Build backend only
npm run build:frontend   # Build frontend only

# Utilities
npm run clean            # Clean all build artifacts
```

## 🎮 How to Play

1. **Open the Game**: Navigate to `http://localhost:3000`
2. **Create Your Farmer**: 
   - Enter your name
   - Choose body type, hair style, hair color, and skin tone
   - Click "Start Farming!"
3. **Start Farming**:
   - Use the hoe (🪓) to till grass tiles
   - Use water (💧) on tilled tiles
   - Plant seeds (🌱) in watered tiles
   - Wait for crops to grow (they change color as they mature)
   - Harvest (✂️) mature crops for money
4. **Manage Resources**:
   - Watch your energy level - actions cost energy
   - Plan your farming strategy efficiently

## 🎯 Controls

### Character Creation
- Click buttons to customize your farmer
- Enter your name in the text field
- Click "Start Farming!" to begin

### In-Game Controls
- **Mouse**: Click tiles to use selected tool
- **H**: Select hoe tool
- **W**: Select water tool
- **P**: Select plant tool
- **G**: Select harvest tool
- **Arrow Keys / WASD**: Move camera around the farm

## 📁 Project Structure

```
microfarm/
├── packages/
│   ├── shared/           # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types.ts  # Game types and interfaces
│   │   │   ├── utils.ts  # Utility functions
│   │   │   └── index.ts  # Main exports
│   │   └── package.json
│   ├── backend/          # Express.js API server
│   │   ├── src/
│   │   │   └── index.ts  # Main server file
│   │   └── package.json
│   └── frontend/         # Vite-based frontend
│       ├── src/
│       │   ├── game/     # Game logic
│       │   ├── ui/       # UI components
│       │   ├── renderers/# Canvas rendering
│       │   ├── services/ # API services
│       │   └── main.ts   # Entry point
│       ├── index.html
│       └── package.json
├── package.json          # Root monorepo config
├── tsconfig.json         # Root TypeScript config
└── README.md
```

## 🔧 API Endpoints

The backend provides the following REST API endpoints:

- `POST /api/players` - Create a new player
- `GET /api/players/:playerId` - Get player and game state
- `POST /api/players/:playerId/use-tool` - Use a tool on a tile
- `PUT /api/players/:playerId/game-state` - Update game state
- `POST /api/players/:playerId/update-crops` - Update crop growth

## 🎨 Game Tips

- **Energy Management**: Each action costs energy, so plan your farming efficiently
- **Crop Growth**: Crops take time to grow through 3 stages (green → bright green → gold)
- **Watering**: Only watered tiles can be planted
- **Harvesting**: Only fully grown crops (gold color) can be harvested
- **Camera Movement**: Use arrow keys to explore your farm

## 🚀 Deployment

### Production Build

```bash
# Build all packages
npm run build

# Start production servers
npm run start:backend  # Backend server
npm run start:frontend # Frontend server
```

### Environment Variables

- `PORT`: Backend server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Enjoy farming! 🌾

# MicroFarm Development Quick Reference

## 🚀 Common Commands

### **Development**
```bash
pnpm install                    # Install all dependencies
pnpm run dev                    # Start both backend and frontend
pnpm run dev:backend           # Start backend only (port 3001)
pnpm run dev:frontend          # Start frontend only (port 3000)
```

### **Building**
```bash
pnpm run build                 # Build all packages
pnpm run build:shared          # Build shared package first
pnpm run build:backend         # Build backend package
pnpm run build:frontend        # Build frontend package
pnpm run clean                 # Clean all build artifacts
```

### **Testing**
```bash
pnpm run test                  # Run all tests
pnpm run test:shared           # Test shared utilities
pnpm run test:backend          # Test API endpoints
pnpm run test:frontend         # Test frontend services
pnpm run test:coverage         # Run tests with coverage
pnpm run test:watch            # Run tests in watch mode
```

## 📁 File Structure

```
microfarm/
├── .cursor/
│   └── rules/
│       └── instructions.mdc  # Development rules
├── docs/
│   ├── README.md            # Documentation index
│   ├── quick-reference.md   # This file
│   └── testing.md           # Testing documentation
├── packages/
│   ├── shared/              # Common types and utilities
│   │   ├── src/
│   │   │   ├── types.ts     # Game interfaces
│   │   │   ├── utils.ts     # Utility functions
│   │   │   └── index.ts     # Main exports
│   │   └── dist/            # Built shared package
│   ├── backend/             # Hono API server
│   │   ├── src/
│   │   │   └── index.ts     # Main server file
│   │   └── dist/            # Built backend
│   └── frontend/            # Vite frontend app
│       ├── src/
│       │   ├── game/        # Game logic
│       │   ├── ui/          # UI components
│       │   ├── renderers/   # Canvas rendering
│       │   ├── services/    # API services
│       │   └── main.ts      # Entry point
│       └── dist/            # Built frontend
└── README.md                # Main project README
```

## 🔧 Type Definitions

### **Core Types**
```typescript
interface Player {
  id: string;
  name: string;
  bodyType: 'slim' | 'average' | 'sturdy';
  hairStyle: 'short' | 'long' | 'curly' | 'bald';
  hairColor: string;
  skinTone: string;
  createdAt: Date;
  lastActive: Date;
}

interface GameState {
  player: Player;
  game: {
    day: number;
    money: number;
    energy: number;
    maxEnergy: number;
    seeds: number;
    currentTool: ToolType;
  };
  farm: {
    tiles: FarmTile[][];
    width: number;
    height: number;
  };
  camera: {
    x: number;
    y: number;
  };
}
```

## 🌐 API Endpoints

### **Player Management**
```bash
POST /api/players              # Create new player
GET /api/players/:id           # Get player and game state
```

### **Game Actions**
```bash
POST /api/players/:id/use-tool # Use tool on tile
PUT /api/players/:id/game-state # Update game state
POST /api/players/:id/update-crops # Update crop growth
```

### **Health Check**
```bash
GET /health                    # Server health status
```

## 🎮 Frontend Service

### **ApiService Methods**
```typescript
class ApiService {
  createPlayer(data: CreatePlayerRequest): Promise<PlayerData>
  getPlayer(id: string): Promise<PlayerData>
  useTool(id: string, tool: ToolType, x: number, y: number): Promise<ToolResult>
  updateGameState(id: string, data: UpdateGameStateRequest): Promise<GameState>
  updateCrops(id: string): Promise<GameState>
}
```

## 🎯 Game Development

### **Tools**
- **Hoe**: Till grass tiles (cost: 5 energy)
- **Water**: Water tilled tiles (cost: 3 energy)
- **Plant**: Plant seeds on watered tiles (cost: 2 energy)
- **Harvest**: Harvest mature crops (cost: 3 energy)

### **Tile States**
1. **Grass** → **Tilled** (with hoe)
2. **Tilled** → **Watered** (with water)
3. **Watered** → **Planted** (with plant)
4. **Planted** → **Mature** (over time)
5. **Mature** → **Harvested** (with harvest)

## 🔧 TypeScript

### **Build Order**
1. **Shared** package first (types and utilities)
2. **Backend** package (depends on shared)
3. **Frontend** package (depends on shared)

### **Module Resolution**
- **Shared**: ES modules for Vite compatibility
- **Backend**: CommonJS for Node.js
- **Frontend**: ES modules with Vite

## 🚨 Error Handling

### **Common Issues**
1. **Build fails**: Run `npm run build:shared` first
2. **Module not found**: Check package dependencies
3. **Type errors**: Ensure shared package is built
4. **Port conflicts**: Check if servers are running

### **Debugging**
```bash
# Check if servers are running
curl http://localhost:3001/health
curl http://localhost:3000

# View logs
npm run dev:backend  # Backend logs
npm run dev:frontend # Frontend logs
```

## 📝 Code Style

### **Naming Conventions**
- **Files**: kebab-case (`character-creation-manager.ts`)
- **Classes**: PascalCase (`GameManager`)
- **Functions**: camelCase (`updateGameState`)
- **Constants**: UPPER_SNAKE_CASE (`GAME_CONSTANTS`)

### **File Organization**
- One class per file
- Group related functionality
- Export only what's needed
- Use barrel exports (index.ts)

## 🧪 Testing

### **Test Structure**
```typescript
describe('Feature Name', () => {
  describe('Method Name', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### **Coverage Goals**
- **Minimum**: 80% overall coverage
- **Target**: 90% overall coverage
- **Current**: 97.95% (Excellent)

## 🚀 Best Practices Summary

1. **Build Order**: Always build shared package first
2. **Type Safety**: Use strict TypeScript, avoid `any`
3. **Testing**: Write tests for all new functionality
4. **Error Handling**: Always handle async operations
5. **Documentation**: Keep docs up-to-date
6. **Code Quality**: Follow the development rules in `.cursor/rules/instructions.mdc`

---

**Quick Start**: `npm install && npm run build:shared && npm run dev`

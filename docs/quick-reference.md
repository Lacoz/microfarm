# MicroFarm Development Quick Reference

## 🚀 Common Commands

### Development
```bash
# Start both servers
npm run dev

# Start individually
npm run dev:backend   # Backend on port 3001
npm run dev:frontend  # Frontend on port 3000

# Build packages
npm run build:shared
npm run build:backend
npm run build:frontend
npm run build         # Build all packages
```

### Package Management
```bash
# Add dependency to specific package
npm install package-name --workspace=packages/backend
npm install package-name --workspace=packages/frontend
npm install package-name --workspace=packages/shared

# Add dev dependency
npm install -D package-name --workspace=packages/backend
```

## 📁 File Structure Patterns

### New Feature Development
```
packages/
├── shared/src/
│   ├── types.ts          # Add new types here
│   └── utils.ts          # Add new utilities here
├── backend/src/
│   └── index.ts          # Add new API endpoints here
└── frontend/src/
    ├── game/             # Add game logic here
    ├── ui/              # Add UI components here
    ├── renderers/       # Add rendering logic here
    └── services/        # Add API services here
```

### Type Definitions Pattern
```typescript
// packages/shared/src/types.ts
export interface NewFeature {
  id: string;
  name: string;
  data: any;
}

export type FeatureStatus = 'active' | 'inactive' | 'pending';
```

### API Endpoint Pattern
```typescript
// packages/backend/src/index.ts
app.post('/api/new-feature', (req, res) => {
  try {
    // Validate input
    // Process request
    // Return response
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});
```

### Frontend Service Pattern
```typescript
// packages/frontend/src/services/NewFeatureService.ts
export class NewFeatureService {
  async createFeature(data: CreateFeatureRequest): Promise<ApiResponse<Feature>> {
    const response = await fetch('/api/new-feature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create feature');
    }
    
    return response.json();
  }
}
```

## 🎮 Game Development Patterns

### Game State Update
```typescript
// Update game state
const newGameState = { ...currentGameState, newProperty: value };
await apiService.updateGameState(playerId, { gameState: newGameState });
```

### Tool Usage Pattern
```typescript
// Use tool on tile
const result = await apiService.useTool(playerId, tool, tileX, tileY);
if (result.success) {
  gameState = result.gameState;
  uiManager.updateGameUI(gameState);
}
```

### Rendering Pattern
```typescript
// Game loop
const gameLoop = () => {
  gameRenderer.render(gameState);
  requestAnimationFrame(gameLoop);
};
```

## 🔧 TypeScript Patterns

### Interface Definition
```typescript
export interface GameComponent {
  id: string;
  type: ComponentType;
  position: { x: number; y: number };
  properties: Record<string, any>;
}
```

### Union Types
```typescript
export type ToolType = 'hoe' | 'water' | 'plant' | 'harvest';
export type TileType = 'grass' | 'tilled' | 'watered' | 'planted';
```

### Utility Functions
```typescript
export function validateGameData(data: unknown): data is GameData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'player' in data &&
    'game' in data
  );
}
```

## 🎯 Error Handling Patterns

### API Error Handling
```typescript
try {
  const result = await apiService.someOperation();
  // Handle success
} catch (error) {
  console.error('Operation failed:', error);
  uiManager.showMessage('Operation failed', 'error');
}
```

### Input Validation
```typescript
function validateInput(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required and must be a string');
  }
  
  return { valid: errors.length === 0, errors };
}
```

## 📝 Code Style Quick Reference

### Naming
- **Files**: `kebab-case.ts`
- **Classes**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase`

### Imports
```typescript
// Prefer specific imports
import { GameState, Player } from '@microfarm/shared';

// Use barrel exports for clean imports
export * from './types';
export * from './utils';
```

### Comments
```typescript
/**
 * Updates the game state with new player data
 * @param playerId - The unique identifier of the player
 * @param data - The new player data to update
 * @returns Promise resolving to the updated game state
 */
async function updatePlayer(playerId: string, data: PlayerData): Promise<GameState> {
  // Implementation
}
```

## 🚨 Common Issues & Solutions

### TypeScript Errors
- **"Cannot find module"**: Check import paths and build shared package
- **"Property does not exist"**: Add proper type definitions
- **"Implicit any"**: Add explicit type annotations

### Monorepo Issues
- **Workspace not found**: Check package.json workspace configuration
- **Build order**: Always build shared package first
- **Dependency issues**: Use workspace-specific install commands

### Development Issues
- **Hot reload not working**: Check file paths and TypeScript config
- **API not responding**: Check server logs and CORS configuration
- **Build failures**: Check TypeScript errors and dependency versions

## 🎯 Best Practices Summary

1. **Keep it Simple**: Choose readable code over clever solutions
2. **Type Everything**: Use TypeScript's type system effectively
3. **Separate Concerns**: Keep UI, logic, and data separate
4. **Handle Errors**: Always implement proper error handling
5. **Document Code**: Add comments for complex logic
6. **Test Regularly**: Write tests for critical functionality
7. **Follow Patterns**: Use established patterns consistently
8. **Optimize Later**: Focus on correctness before optimization

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { 
  Player, 
  GameState, 
  CreatePlayerRequest, 
  UpdateGameStateRequest, 
  ApiResponse,
  GAME_CONSTANTS,
  ToolType,
  FarmTile
} from '@microfarm/shared';
import { initializeFarm, generateId, validatePlayerData, getEnergyCost, canUseTool, calculateHarvestValue } from '@microfarm/shared';

const app = express();
const PORT = process.env.PORT || 3001;

// In-memory storage (in production, use a database)
const players = new Map<string, Player>();
const gameStates = new Map<string, GameState>();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Initialize a new game state for a player
function createGameState(player: Player): GameState {
  return {
    player,
    game: {
      day: 1,
      money: GAME_CONSTANTS.INITIAL_MONEY,
      energy: GAME_CONSTANTS.INITIAL_ENERGY,
      maxEnergy: GAME_CONSTANTS.INITIAL_ENERGY,
      seeds: GAME_CONSTANTS.INITIAL_SEEDS,
      currentTool: 'hoe'
    },
    farm: {
      tiles: initializeFarm(20, 15),
      width: 20,
      height: 15
    },
    camera: {
      x: 0,
      y: 0
    }
  };
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create a new player
app.post('/api/players', (req, res) => {
  try {
    const playerData: CreatePlayerRequest = req.body;
    
    // Validate player data
    const validation = validatePlayerData(playerData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid player data',
        details: validation.errors
      } as ApiResponse);
    }
    
    // Create player
    const player: Player = {
      id: uuidv4(),
      name: playerData.name.trim(),
      bodyType: playerData.bodyType,
      hairStyle: playerData.hairStyle,
      hairColor: playerData.hairColor,
      skinTone: playerData.skinTone,
      createdAt: new Date(),
      lastActive: new Date()
    };
    
    // Store player
    players.set(player.id, player);
    
    // Create initial game state
    const gameState = createGameState(player);
    gameStates.set(player.id, gameState);
    
    res.status(201).json({
      success: true,
      data: { player, gameState }
    } as ApiResponse);
    
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Get player and game state
app.get('/api/players/:playerId', (req, res) => {
  try {
    const { playerId } = req.params;
    
    const player = players.get(playerId);
    if (!player) {
      return res.status(404).json({
        success: false,
        error: 'Player not found'
      } as ApiResponse);
    }
    
    const gameState = gameStates.get(playerId);
    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: 'Game state not found'
      } as ApiResponse);
    }
    
    // Update last active
    player.lastActive = new Date();
    
    res.json({
      success: true,
      data: { player, gameState }
    } as ApiResponse);
    
  } catch (error) {
    console.error('Error getting player:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Use tool on farm tile
app.post('/api/players/:playerId/use-tool', (req, res) => {
  try {
    const { playerId } = req.params;
    const { tool, tileX, tileY } = req.body;
    
    const gameState = gameStates.get(playerId);
    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: 'Game state not found'
      } as ApiResponse);
    }
    
    // Validate coordinates
    if (tileX < 0 || tileX >= gameState.farm.width || tileY < 0 || tileY >= gameState.farm.height) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tile coordinates'
      } as ApiResponse);
    }
    
    const tile = gameState.farm.tiles[tileY][tileX];
    const energyCost = getEnergyCost(tool as ToolType);
    
    // Check if player has enough energy
    if (gameState.game.energy < energyCost) {
      return res.status(400).json({
        success: false,
        error: 'Not enough energy'
      } as ApiResponse);
    }
    
    // Check if tool can be used on this tile
    if (!canUseTool(tile, tool as ToolType)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot use this tool on this tile'
      } as ApiResponse);
    }
    
    // Apply tool effect
    let success = false;
    let harvestValue = 0;
    
    switch (tool) {
      case 'hoe':
        if (tile.type === 'grass') {
          tile.type = 'tilled';
          success = true;
        }
        break;
        
      case 'water':
        if (tile.type === 'tilled' && !tile.watered) {
          tile.watered = true;
          tile.lastWatered = new Date();
          success = true;
        }
        break;
        
      case 'plant':
        if (tile.type === 'tilled' && tile.watered && !tile.planted && gameState.game.seeds > 0) {
          tile.planted = true;
          tile.growthStage = 1;
          tile.growthTime = 0;
          tile.maxGrowthTime = GAME_CONSTANTS.GROWTH_TIME;
          gameState.game.seeds--;
          success = true;
        }
        break;
        
      case 'harvest':
        if (tile.planted && tile.growthStage >= GAME_CONSTANTS.GROWTH_STAGES) {
          harvestValue = calculateHarvestValue(tile.growthStage);
          gameState.game.money += harvestValue;
          tile.planted = false;
          tile.growthStage = 0;
          tile.watered = false;
          tile.type = 'grass';
          success = true;
        }
        break;
    }
    
    if (success) {
      gameState.game.energy -= energyCost;
      gameState.game.currentTool = tool as ToolType;
      
      // Update last active
      const player = players.get(playerId);
      if (player) {
        player.lastActive = new Date();
      }
    }
    
    res.json({
      success: true,
      data: {
        success,
        energyCost,
        harvestValue,
        gameState
      }
    } as ApiResponse);
    
  } catch (error) {
    console.error('Error using tool:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Update game state (for camera movement, etc.)
app.put('/api/players/:playerId/game-state', (req, res) => {
  try {
    const { playerId } = req.params;
    const updateData: UpdateGameStateRequest = req.body;
    
    const gameState = gameStates.get(playerId);
    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: 'Game state not found'
      } as ApiResponse);
    }
    
    // Update allowed fields
    if (updateData.gameState.camera) {
      gameState.camera = { ...gameState.camera, ...updateData.gameState.camera };
    }
    
    if (updateData.gameState.game?.currentTool) {
      gameState.game.currentTool = updateData.gameState.game.currentTool;
    }
    
    // Update last active
    const player = players.get(playerId);
    if (player) {
      player.lastActive = new Date();
    }
    
    res.json({
      success: true,
      data: { gameState }
    } as ApiResponse);
    
  } catch (error) {
    console.error('Error updating game state:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Update crop growth (called periodically)
app.post('/api/players/:playerId/update-crops', (req, res) => {
  try {
    const { playerId } = req.params;
    
    const gameState = gameStates.get(playerId);
    if (!gameState) {
      return res.status(404).json({
        success: false,
        error: 'Game state not found'
      } as ApiResponse);
    }
    
    // Update crop growth
    for (let y = 0; y < gameState.farm.height; y++) {
      for (let x = 0; x < gameState.farm.width; x++) {
        const tile = gameState.farm.tiles[y][x];
        if (tile.planted && tile.growthStage < GAME_CONSTANTS.GROWTH_STAGES) {
          tile.growthTime++;
          if (tile.growthTime >= tile.maxGrowthTime) {
            tile.growthStage++;
            tile.growthTime = 0;
          }
        }
      }
    }
    
    res.json({
      success: true,
      data: { gameState }
    } as ApiResponse);
    
  } catch (error) {
    console.error('Error updating crops:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 MicroFarm Backend Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}

// Export for testing
export default app;

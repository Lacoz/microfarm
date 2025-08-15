import { describe, it, expect, beforeAll } from '@jest/globals';
import { Hono } from 'hono';
import { 
  Player, 
  CreatePlayerRequest, 
  ToolType,
  GAME_CONSTANTS 
} from '@microfarm/shared';

// Import the app without starting the server
let app: Hono;

beforeAll(async () => {
  // Import the app module
  const appModule = await import('../index');
  app = appModule.default;
});

// Helper function to make requests to Hono app
async function makeRequest(method: string, path: string, body?: any) {
  const url = new URL(`http://localhost${path}`);
  const requestInit: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    requestInit.body = JSON.stringify(body);
  }

  const request = new Request(url.toString(), requestInit);
  const response = await app.fetch(request);
  const responseBody = await response.json();

  return {
    status: response.status,
    body: responseBody,
    headers: response.headers,
  };
}

describe('API Endpoints', () => {
  let playerId: string;
  let player: Player;

  describe('POST /api/players', () => {
    it('should create a new player successfully', async () => {
      const playerData: CreatePlayerRequest = {
        name: 'Test Farmer',
        bodyType: 'average',
        hairStyle: 'short',
        hairColor: '#8B4513',
        skinTone: '#FDBB7D'
      };

      const response = await makeRequest('POST', '/api/players', playerData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.player).toBeDefined();
      expect(response.body.data.gameState).toBeDefined();

      player = response.body.data.player;
      playerId = player.id;

      expect(player.name).toBe('Test Farmer');
      expect(player.bodyType).toBe('average');
      expect(player.hairStyle).toBe('short');
      expect(player.hairColor).toBe('#8B4513');
      expect(player.skinTone).toBe('#FDBB7D');
      expect(player.id).toBeDefined();
      expect(player.createdAt).toBeDefined();
      expect(player.lastActive).toBeDefined();
    });

    it('should reject invalid player data', async () => {
      const invalidData = {
        name: '',
        bodyType: 'invalid',
        hairStyle: 'invalid',
        hairColor: '',
        skinTone: ''
      };

      const response = await makeRequest('POST', '/api/players', invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid player data');
      expect(response.body.details).toBeDefined();
      expect(response.body.details.length).toBeGreaterThan(0);
    });

    it('should reject missing required fields', async () => {
      const incompleteData = {
        name: 'Test Farmer'
        // Missing other required fields
      };

      const response = await makeRequest('POST', '/api/players', incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/players/:playerId', () => {
    it('should return player and game state', async () => {
      const response = await makeRequest('GET', `/api/players/${playerId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.player).toBeDefined();
      expect(response.body.data.gameState).toBeDefined();

      const returnedPlayer = response.body.data.player;
      const gameState = response.body.data.gameState;

      expect(returnedPlayer.id).toBe(playerId);
      expect(returnedPlayer.name).toBe('Test Farmer');
      expect(gameState.player.id).toBe(playerId);
      expect(gameState.game.money).toBe(GAME_CONSTANTS.INITIAL_MONEY);
      expect(gameState.game.energy).toBe(GAME_CONSTANTS.INITIAL_ENERGY);
      expect(gameState.game.seeds).toBe(GAME_CONSTANTS.INITIAL_SEEDS);
    });

    it('should return 404 for non-existent player', async () => {
      const response = await makeRequest('GET', '/api/players/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Player not found');
    });
  });

  describe('POST /api/players/:playerId/use-tool', () => {
    it('should use hoe tool successfully', async () => {
      const toolData = {
        tool: 'hoe' as ToolType,
        tileX: 0,
        tileY: 0
      };

      const response = await makeRequest('POST', `/api/players/${playerId}/use-tool`, toolData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.success).toBe(true);
      expect(response.body.data.energyCost).toBe(GAME_CONSTANTS.ENERGY_COSTS.hoe);
      expect(response.body.data.gameState.game.energy).toBe(
        GAME_CONSTANTS.INITIAL_ENERGY - GAME_CONSTANTS.ENERGY_COSTS.hoe
      );
    });

    it('should use water tool on tilled tile', async () => {
      // First till the tile
      await makeRequest('POST', `/api/players/${playerId}/use-tool`, { tool: 'hoe', tileX: 1, tileY: 1 });

      // Then water it
      const response = await makeRequest('POST', `/api/players/${playerId}/use-tool`, { tool: 'water', tileX: 1, tileY: 1 });

      expect(response.status).toBe(200);
      expect(response.body.data.success).toBe(true);
      expect(response.body.data.energyCost).toBe(GAME_CONSTANTS.ENERGY_COSTS.water);
    });

    it('should use plant tool on watered tile', async () => {
      // First till and water the tile
      await makeRequest('POST', `/api/players/${playerId}/use-tool`, { tool: 'hoe', tileX: 2, tileY: 2 });
      await makeRequest('POST', `/api/players/${playerId}/use-tool`, { tool: 'water', tileX: 2, tileY: 2 });

      // Then plant
      const response = await makeRequest('POST', `/api/players/${playerId}/use-tool`, { tool: 'plant', tileX: 2, tileY: 2 });

      expect(response.status).toBe(200);
      expect(response.body.data.success).toBe(true);
      expect(response.body.data.energyCost).toBe(GAME_CONSTANTS.ENERGY_COSTS.plant);
    });

    it('should reject invalid tile coordinates', async () => {
      const response = await makeRequest('POST', `/api/players/${playerId}/use-tool`, { tool: 'hoe', tileX: 100, tileY: 100 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid tile coordinates');
    });

    it('should reject tool usage when not enough energy', async () => {
      // Use up all energy
      for (let i = 0; i < 20; i++) {
        await makeRequest('POST', `/api/players/${playerId}/use-tool`, { tool: 'hoe', tileX: i, tileY: 0 });
      }

      const response = await makeRequest('POST', `/api/players/${playerId}/use-tool`, { tool: 'hoe', tileX: 5, tileY: 5 });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not enough energy');
    });

    it('should reject invalid tool usage', async () => {
      const response = await makeRequest('POST', `/api/players/${playerId}/use-tool`, { tool: 'water', tileX: 0, tileY: 0 }); // Water on grass

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Not enough energy'); // Player ran out of energy in previous tests
    });
  });

  describe('PUT /api/players/:playerId/game-state', () => {
    it('should update camera position', async () => {
      const updateData = {
        playerId,
        gameState: {
          camera: { x: 10, y: 20 }
        }
      };

      const response = await makeRequest('PUT', `/api/players/${playerId}/game-state`, updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.gameState.camera.x).toBe(10);
      expect(response.body.data.gameState.camera.y).toBe(20);
    });

    it('should update current tool', async () => {
      const updateData = {
        playerId,
        gameState: {
          game: { currentTool: 'water' as ToolType }
        }
      };

      const response = await makeRequest('PUT', `/api/players/${playerId}/game-state`, updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.gameState.game.currentTool).toBe('water');
    });
  });

  describe('POST /api/players/:playerId/update-crops', () => {
    it('should update crop growth', async () => {
      // Create a fresh player for this test
      const freshPlayerData = {
        name: 'Crop Test Farmer',
        bodyType: 'average' as const,
        hairStyle: 'short' as const,
        hairColor: '#8B4513',
        skinTone: '#FDBB7D'
      };

      const createResponse = await makeRequest('POST', '/api/players', freshPlayerData);

      expect(createResponse.status).toBe(201);
      const freshPlayerId = createResponse.body.data.player.id;

      // First plant a crop
      await makeRequest('POST', `/api/players/${freshPlayerId}/use-tool`, { tool: 'hoe', tileX: 3, tileY: 3 });
      await makeRequest('POST', `/api/players/${freshPlayerId}/use-tool`, { tool: 'water', tileX: 3, tileY: 3 });
      await makeRequest('POST', `/api/players/${freshPlayerId}/use-tool`, { tool: 'plant', tileX: 3, tileY: 3 });

      // Update crops
      const response = await makeRequest('POST', `/api/players/${freshPlayerId}/update-crops`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.gameState).toBeDefined();
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await makeRequest('GET', '/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
    });
  });
});

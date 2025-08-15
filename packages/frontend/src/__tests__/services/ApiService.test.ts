import { ApiService } from '../../services/ApiService';
import { CreatePlayerRequest, ToolType } from '@microfarm/shared';

// Mock fetch
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService();
    jest.clearAllMocks();
  });

  describe('createPlayer', () => {
    it('should create a player successfully', async () => {
      const playerData: CreatePlayerRequest = {
        name: 'Test Farmer',
        bodyType: 'average',
        hairStyle: 'short',
        hairColor: '#8B4513',
        skinTone: '#FDBB7D'
      };

      const mockResponse = {
        success: true,
        data: {
          player: {
            id: 'test-id',
            name: 'Test Farmer',
            bodyType: 'average',
            hairStyle: 'short',
            hairColor: '#8B4513',
            skinTone: '#FDBB7D',
            createdAt: new Date(),
            lastActive: new Date()
          },
          gameState: {
            player: { id: 'test-id' },
            game: { day: 1, money: 100, energy: 100, maxEnergy: 100, seeds: 5, currentTool: 'hoe' },
            farm: { tiles: [], width: 20, height: 15 },
            camera: { x: 0, y: 0 }
          }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await apiService.createPlayer(playerData);

      expect(mockFetch).toHaveBeenCalledWith('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData)
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on failed request', async () => {
      const playerData: CreatePlayerRequest = {
        name: 'Test Farmer',
        bodyType: 'average',
        hairStyle: 'short',
        hairColor: '#8B4513',
        skinTone: '#FDBB7D'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid player data' })
      } as Response);

      await expect(apiService.createPlayer(playerData)).rejects.toThrow('Invalid player data');
    });
  });

  describe('getPlayer', () => {
    it('should get player successfully', async () => {
      const playerId = 'test-id';
      const mockResponse = {
        success: true,
        data: {
          player: { id: playerId, name: 'Test Farmer' },
          gameState: { player: { id: playerId } }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await apiService.getPlayer(playerId);

      expect(mockFetch).toHaveBeenCalledWith(`/api/players/${playerId}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on failed request', async () => {
      const playerId = 'test-id';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Player not found' })
      } as Response);

      await expect(apiService.getPlayer(playerId)).rejects.toThrow('Player not found');
    });
  });

  describe('useTool', () => {
    it('should use tool successfully', async () => {
      const playerId = 'test-id';
      const tool: ToolType = 'hoe';
      const tileX = 0;
      const tileY = 0;

      const mockResponse = {
        success: true,
        data: {
          success: true,
          energyCost: 5,
          harvestValue: 0,
          gameState: { player: { id: playerId } }
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await apiService.useTool(playerId, tool, tileX, tileY);

      expect(mockFetch).toHaveBeenCalledWith(`/api/players/${playerId}/use-tool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, tileX, tileY })
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on failed request', async () => {
      const playerId = 'test-id';
      const tool: ToolType = 'hoe';
      const tileX = 0;
      const tileY = 0;

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Not enough energy' })
      } as Response);

      await expect(apiService.useTool(playerId, tool, tileX, tileY)).rejects.toThrow('Not enough energy');
    });
  });

  describe('updateGameState', () => {
    it('should update game state successfully', async () => {
      const playerId = 'test-id';
      const updateData = {
        playerId,
        gameState: { camera: { x: 10, y: 20 } }
      };

      const mockResponse = {
        success: true,
        data: { gameState: { camera: { x: 10, y: 20 } } }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await apiService.updateGameState(playerId, updateData);

      expect(mockFetch).toHaveBeenCalledWith(`/api/players/${playerId}/game-state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on failed request', async () => {
      const playerId = 'test-id';
      const updateData = {
        playerId,
        gameState: { camera: { x: 10, y: 20 } }
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Game state not found' })
      } as Response);

      await expect(apiService.updateGameState(playerId, updateData)).rejects.toThrow('Game state not found');
    });
  });

  describe('updateCrops', () => {
    it('should update crops successfully', async () => {
      const playerId = 'test-id';

      const mockResponse = {
        success: true,
        data: { gameState: { farm: { tiles: [] } } }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      } as Response);

      const result = await apiService.updateCrops(playerId);

      expect(mockFetch).toHaveBeenCalledWith(`/api/players/${playerId}/update-crops`, {
        method: 'POST'
      });

      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error on failed request', async () => {
      const playerId = 'test-id';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Game state not found' })
      } as Response);

      await expect(apiService.updateCrops(playerId)).rejects.toThrow('Game state not found');
    });
  });
});

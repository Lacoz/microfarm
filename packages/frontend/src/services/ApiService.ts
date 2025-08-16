import type { 
  Player, 
  GameState, 
  CreatePlayerRequest, 
  UpdateGameStateRequest, 
  ApiResponse,
  ToolType 
} from '@microfarm/shared';

export class ApiService {
  private baseUrl = '/api';

  async createPlayer(playerData: CreatePlayerRequest): Promise<{ player: Player; gameState: GameState }> {
    const response = await fetch(`${this.baseUrl}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create player');
    }

    const result: ApiResponse<{ player: Player; gameState: GameState }> = await response.json();
    return result.data!;
  }

  async getPlayer(playerId: string): Promise<{ player: Player; gameState: GameState }> {
    const response = await fetch(`${this.baseUrl}/players/${playerId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get player');
    }

    const result: ApiResponse<{ player: Player; gameState: GameState }> = await response.json();
    return result.data!;
  }

  async useTool(playerId: string, tool: ToolType, tileX: number, tileY: number): Promise<{
    success: boolean;
    energyCost: number;
    harvestValue: number;
    gameState: GameState;
  }> {
    const response = await fetch(`${this.baseUrl}/players/${playerId}/use-tool`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tool, tileX, tileY }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to use tool');
    }

    const result: ApiResponse<{
      success: boolean;
      energyCost: number;
      harvestValue: number;
      gameState: GameState;
    }> = await response.json();
    return result.data!;
  }

  async updateGameState(playerId: string, updateData: UpdateGameStateRequest): Promise<{ gameState: GameState }> {
    const response = await fetch(`${this.baseUrl}/players/${playerId}/game-state`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update game state');
    }

    const result: ApiResponse<{ gameState: GameState }> = await response.json();
    return result.data!;
  }

  async updateCrops(playerId: string): Promise<{ gameState: GameState }> {
    const response = await fetch(`${this.baseUrl}/players/${playerId}/update-crops`, {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update crops');
    }

    const result: ApiResponse<{ gameState: GameState }> = await response.json();
    return result.data!;
  }
}

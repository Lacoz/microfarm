import { GameState, CreatePlayerRequest, ToolType, UpdateGameStateRequest } from '@microfarm/shared';
import { ApiService } from '../services/ApiService';
import { UIManager } from '../ui/UIManager';
import { GameRenderer } from '../renderers/GameRenderer';

export class GameManager {
  private apiService: ApiService;
  private uiManager: UIManager;
  private gameRenderer: GameRenderer;
  private gameState: GameState | null = null;
  private playerId: string | null = null;
  private animationFrameId: number | null = null;
  private cropUpdateInterval: number | null = null;

  constructor(apiService: ApiService, uiManager: UIManager) {
    this.apiService = apiService;
    this.uiManager = uiManager;
    this.gameRenderer = new GameRenderer();
  }

  async startGame(playerData: CreatePlayerRequest): Promise<void> {
    try {
      // Create player and get initial game state
      const result = await this.apiService.createPlayer(playerData);
      this.gameState = result.gameState;
      this.playerId = result.player.id;

      // Switch to game screen
      this.uiManager.switchToGameScreen();

      // Setup game controls
      this.setupGameControls();

      // Start game loop
      this.startGameLoop();

      // Start crop update interval
      this.startCropUpdateInterval();

      // Update UI
      this.uiManager.updateGameUI(this.gameState);

    } catch (error) {
      console.error('Failed to start game:', error);
      this.uiManager.showMessage('Failed to start game', 'error');
      throw error;
    }
  }

  private setupGameControls(): void {
    if (!this.gameState) return;

    // Setup tool buttons
    this.uiManager.setupToolButtons((tool: string) => {
      this.gameState!.game.currentTool = tool as ToolType;
    });

    // Setup keyboard controls
    this.uiManager.setupKeyboardControls(
      (tool: string) => {
        this.gameState!.game.currentTool = tool as ToolType;
      },
      (direction: string) => {
        this.moveCamera(direction);
      }
    );

    // Setup canvas click events
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    canvas.addEventListener('click', (e) => {
      this.handleCanvasClick(e);
    });

    canvas.addEventListener('mousemove', (e) => {
      this.handleCanvasMouseMove(e);
    });
  }

  private handleCanvasClick(e: MouseEvent): void {
    if (!this.gameState || !this.playerId) return;

    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tileCoords = this.gameRenderer.getTileAtScreenPosition(x, y, this.gameState);
    if (tileCoords) {
      this.useTool(tileCoords.x, tileCoords.y);
    }
  }

  private handleCanvasMouseMove(e: MouseEvent): void {
    if (!this.gameState) return;

    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const tileCoords = this.gameRenderer.getTileAtScreenPosition(x, y, this.gameState);
    const canvas = e.target as HTMLCanvasElement;
    
    if (tileCoords) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'crosshair';
    }
  }

  private async useTool(tileX: number, tileY: number): Promise<void> {
    if (!this.gameState || !this.playerId) return;

    try {
      const result = await this.apiService.useTool(
        this.playerId,
        this.gameState.game.currentTool,
        tileX,
        tileY
      );

      if (result.success) {
        this.gameState = result.gameState;
        this.uiManager.updateGameUI(this.gameState);

        if (result.harvestValue > 0) {
          this.uiManager.showMessage(`Harvested! +$${result.harvestValue}`, 'success');
        }
      } else {
        this.uiManager.showMessage('Cannot use tool here', 'error');
      }
    } catch (error) {
      console.error('Failed to use tool:', error);
      this.uiManager.showMessage('Failed to use tool', 'error');
    }
  }

  private async moveCamera(direction: string): Promise<void> {
    if (!this.gameState || !this.playerId) return;

    const cameraSpeed = 10;
    let newCamera = { ...this.gameState.camera };

    switch (direction) {
      case 'up':
        newCamera.y += cameraSpeed;
        break;
      case 'down':
        newCamera.y -= cameraSpeed;
        break;
      case 'left':
        newCamera.x += cameraSpeed;
        break;
      case 'right':
        newCamera.x -= cameraSpeed;
        break;
    }

    try {
      const updateData: UpdateGameStateRequest = {
        playerId: this.playerId,
        gameState: { camera: newCamera }
      };

      const result = await this.apiService.updateGameState(this.playerId, updateData);
      this.gameState = result.gameState;
    } catch (error) {
      console.error('Failed to move camera:', error);
    }
  }

  private startGameLoop(): void {
    const gameLoop = () => {
      if (this.gameState) {
        this.gameRenderer.render(this.gameState);
      }
      this.animationFrameId = requestAnimationFrame(gameLoop);
    };
    gameLoop();
  }

  private startCropUpdateInterval(): void {
    this.cropUpdateInterval = window.setInterval(async () => {
      if (this.playerId) {
        try {
          const result = await this.apiService.updateCrops(this.playerId);
          this.gameState = result.gameState;
        } catch (error) {
          console.error('Failed to update crops:', error);
        }
      }
    }, 1000); // Update every second
  }

  stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.cropUpdateInterval) {
      clearInterval(this.cropUpdateInterval);
      this.cropUpdateInterval = null;
    }
  }
}

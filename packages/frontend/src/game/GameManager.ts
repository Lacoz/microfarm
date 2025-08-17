import type { GameState, CreatePlayerRequest, ToolType, UpdateGameStateRequest } from '@microfarm/shared';
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
  private cropUpdateMs: number = 3000;

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

      // Start crop update interval (throttled)
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

    const cameraSpeed = 16;
    let newCamera = { ...this.gameState.camera };

    switch (direction) {
      case 'up':
        newCamera.y += cameraSpeed; // scroll map down visually
        this.gameRenderer.setFacing('up');
        this.gameRenderer.setRunning(true);
        break;
      case 'down':
        newCamera.y -= cameraSpeed; // scroll map up visually
        this.gameRenderer.setFacing('down');
        this.gameRenderer.setRunning(true);
        break;
      case 'left':
        newCamera.x += cameraSpeed; // scroll map right visually
        this.gameRenderer.setFacing('left');
        this.gameRenderer.setRunning(true);
        break;
      case 'right':
        newCamera.x -= cameraSpeed; // scroll map left visually
        this.gameRenderer.setFacing('right');
        this.gameRenderer.setRunning(true);
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
    // briefly show running, then stop
    setTimeout(() => this.gameRenderer.setRunning(false), 120);
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
    const tick = async () => {
      if (!this.playerId) return;
      if (document.hidden) return; // pause when tab hidden
      try {
        const result = await this.apiService.updateCrops(this.playerId);
        this.gameState = result.gameState;
      } catch (error) {
        console.error('Failed to update crops:', error);
      }
    };

    // Immediate first tick, then interval
    void tick();
    this.cropUpdateInterval = window.setInterval(tick, this.cropUpdateMs);
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

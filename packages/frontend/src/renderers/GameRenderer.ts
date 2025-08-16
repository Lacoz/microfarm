import type { GameState, FarmTile } from '@microfarm/shared';
import { GAME_CONSTANTS, screenToTile, tileToScreen } from '@microfarm/shared';
import { CharacterRenderer } from './CharacterRenderer';

export class GameRenderer {
  private characterRenderer: CharacterRenderer;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private centerX: number;
  private centerY: number;

  constructor() {
    this.characterRenderer = new CharacterRenderer();
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }

  render(gameState: GameState): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw farm tiles
    this.drawFarm(gameState.farm);
    
    // Draw player
    this.drawPlayer(gameState.player, gameState.camera);
  }

  private drawFarm(farm: GameState['farm']): void {
    for (let y = 0; y < farm.height; y++) {
      for (let x = 0; x < farm.width; x++) {
        const tile = farm.tiles[y][x];
        const screenPos = tileToScreen(x, y, this.centerX, this.centerY, 0, 0);
        
        // Skip tiles outside view
        if (screenPos.x < -50 || screenPos.x > this.canvas.width + 50 || 
            screenPos.y < -50 || screenPos.y > this.canvas.height + 50) {
          continue;
        }
        
        this.drawTile(screenPos.x, screenPos.y, tile);
      }
    }
  }

  private drawTile(x: number, y: number, tile: FarmTile): void {
    const colors = {
      grass: '#90EE90',
      tilled: '#8B4513',
      watered: '#4169E1',
      planted: '#228B22'
    };
    
    // Tile color based on type
    let color = colors[tile.type];
    if (tile.watered && tile.type === 'tilled') {
      color = colors.watered;
    }
    if (tile.planted) {
      color = colors.planted;
    }
    
    // Draw isometric tile
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = '#2F4F2F';
    this.ctx.lineWidth = 1;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - GAME_CONSTANTS.TILE_HEIGHT);
    this.ctx.lineTo(x + GAME_CONSTANTS.TILE_WIDTH/2, y);
    this.ctx.lineTo(x, y + GAME_CONSTANTS.TILE_HEIGHT);
    this.ctx.lineTo(x - GAME_CONSTANTS.TILE_WIDTH/2, y);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    
    // Draw crop if planted
    if (tile.planted && tile.growthStage > 0) {
      this.drawCrop(x, y, tile.growthStage);
    }
  }

  private drawCrop(x: number, y: number, growthStage: number): void {
    const colors = ['#228B22', '#32CD32', '#FFD700'];
    const color = colors[Math.min(growthStage - 1, colors.length - 1)];
    
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y - GAME_CONSTANTS.TILE_HEIGHT/2, 3 + growthStage * 2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawPlayer(player: GameState['player'], camera: GameState['camera']): void {
    const playerX = this.centerX + camera.x;
    const playerY = this.centerY + camera.y;
    
    this.characterRenderer.drawCharacter(this.ctx, playerX, playerY, player);
  }

  getTileAtScreenPosition(screenX: number, screenY: number, gameState: GameState): { x: number; y: number } | null {
    return screenToTile(
      screenX, 
      screenY, 
      this.centerX, 
      this.centerY, 
      gameState.camera.x, 
      gameState.camera.y,
      gameState.farm.width,
      gameState.farm.height
    );
  }
}

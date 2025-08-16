import type { FarmTile, TileType, ToolType } from './types.js';
import { GAME_CONSTANTS } from './types.js';

/**
 * Initialize a new farm with grass tiles
 */
export function initializeFarm(width: number, height: number): FarmTile[][] {
  const tiles: FarmTile[][] = [];
  for (let y = 0; y < height; y++) {
    tiles[y] = [];
    for (let x = 0; x < width; x++) {
      tiles[y][x] = {
        type: 'grass',
        watered: false,
        planted: false,
        growthStage: 0,
        growthTime: 0,
        maxGrowthTime: 0
      };
    }
  }
  return tiles;
}

/**
 * Convert screen coordinates to tile coordinates in isometric view
 */
export function screenToTile(
  screenX: number, 
  screenY: number, 
  centerX: number, 
  centerY: number, 
  cameraX: number, 
  cameraY: number,
  farmWidth: number,
  farmHeight: number
): { x: number; y: number } | null {
  const adjustedX = screenX - centerX - cameraX;
  const adjustedY = screenY - centerY - cameraY;
  
  const tileX = Math.round((adjustedX / (GAME_CONSTANTS.TILE_WIDTH / 2) + adjustedY / (GAME_CONSTANTS.TILE_HEIGHT / 2)) / 2);
  const tileY = Math.round((adjustedY / (GAME_CONSTANTS.TILE_HEIGHT / 2) - adjustedX / (GAME_CONSTANTS.TILE_WIDTH / 2)) / 2);
  
  if (tileX >= 0 && tileX < farmWidth && tileY >= 0 && tileY < farmHeight) {
    return { x: tileX, y: tileY };
  }
  return null;
}

/**
 * Convert tile coordinates to screen coordinates in isometric view
 */
export function tileToScreen(
  tileX: number, 
  tileY: number, 
  centerX: number, 
  centerY: number, 
  cameraX: number, 
  cameraY: number
): { x: number; y: number } {
  const isoX = centerX + (tileX - tileY) * GAME_CONSTANTS.TILE_WIDTH / 2 + cameraX;
  const isoY = centerY + (tileX + tileY) * GAME_CONSTANTS.TILE_HEIGHT / 2 + cameraY;
  
  return { x: isoX, y: isoY };
}

/**
 * Get energy cost for using a tool
 */
export function getEnergyCost(tool: ToolType): number {
  return GAME_CONSTANTS.ENERGY_COSTS[tool];
}

/**
 * Calculate harvest value based on growth stage
 */
export function calculateHarvestValue(growthStage: number): number {
  return 10 + growthStage * 5;
}

/**
 * Check if a tile can be used with a specific tool
 */
export function canUseTool(tile: FarmTile, tool: ToolType): boolean {
  switch (tool) {
    case 'hoe':
      return tile.type === 'grass';
    case 'water':
      return tile.type === 'tilled' && !tile.watered;
    case 'plant':
      return tile.type === 'tilled' && tile.watered && !tile.planted;
    case 'harvest':
      return tile.planted && tile.growthStage >= GAME_CONSTANTS.GROWTH_STAGES;
    default:
      return false;
  }
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Validate player data
 */
export function validatePlayerData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Name is required and must be a non-empty string');
  }
  
  if (!data.bodyType || !['slim', 'average', 'sturdy'].includes(data.bodyType)) {
    errors.push('Valid body type is required');
  }
  
  if (!data.hairStyle || !['short', 'long', 'curly', 'bald'].includes(data.hairStyle)) {
    errors.push('Valid hair style is required');
  }
  
  if (!data.hairColor || typeof data.hairColor !== 'string') {
    errors.push('Valid hair color is required');
  }
  
  if (!data.skinTone || typeof data.skinTone !== 'string') {
    errors.push('Valid skin tone is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

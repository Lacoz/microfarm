import { describe, it, expect } from 'vitest';
import {
  initializeFarm,
  screenToTile,
  tileToScreen,
  getEnergyCost,
  calculateHarvestValue,
  canUseTool,
  generateId,
  validatePlayerData
} from '../utils.js';
import type { ToolType, FarmTile } from '../types.js';

describe('Game Utils', () => {
  describe('initializeFarm', () => {
    it('should create a farm with correct dimensions', () => {
      const width = 10;
      const height = 8;
      const farm = initializeFarm(width, height);

      expect(farm).toHaveLength(height);
      expect(farm[0]).toHaveLength(width);
    });

    it('should initialize all tiles as grass', () => {
      const farm = initializeFarm(3, 3);

      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          const tile = farm[y][x];
          expect(tile.type).toBe('grass');
          expect(tile.watered).toBe(false);
          expect(tile.planted).toBe(false);
          expect(tile.growthStage).toBe(0);
          expect(tile.growthTime).toBe(0);
          expect(tile.maxGrowthTime).toBe(0);
        }
      }
    });
  });

  describe('screenToTile', () => {
    it('should convert screen coordinates to tile coordinates', () => {
      const centerX = 400;
      const centerY = 300;
      const cameraX = 0;
      const cameraY = 0;
      const farmWidth = 20;
      const farmHeight = 15;

      // Test center tile
      const centerTile = screenToTile(centerX, centerY, centerX, centerY, cameraX, cameraY, farmWidth, farmHeight);
      expect(centerTile).toEqual({ x: 0, y: 0 });
    });

    it('should return null for coordinates outside farm bounds', () => {
      const centerX = 400;
      const centerY = 300;
      const cameraX = 0;
      const cameraY = 0;
      const farmWidth = 5;
      const farmHeight = 5;

      // Test coordinates outside bounds
      const outsideTile = screenToTile(1000, 1000, centerX, centerY, cameraX, cameraY, farmWidth, farmHeight);
      expect(outsideTile).toBeNull();
    });
  });

  describe('tileToScreen', () => {
    it('should convert tile coordinates to screen coordinates', () => {
      const centerX = 400;
      const centerY = 300;
      const cameraX = 0;
      const cameraY = 0;

      // Test center tile
      const centerScreen = tileToScreen(0, 0, centerX, centerY, cameraX, cameraY);
      expect(centerScreen).toEqual({ x: centerX, y: centerY });
    });
  });

  describe('getEnergyCost', () => {
    it('should return correct energy costs for all tools', () => {
      expect(getEnergyCost('hoe')).toBe(5);
      expect(getEnergyCost('water')).toBe(3);
      expect(getEnergyCost('plant')).toBe(2);
      expect(getEnergyCost('harvest')).toBe(3);
    });
  });

  describe('calculateHarvestValue', () => {
    it('should calculate correct harvest values', () => {
      expect(calculateHarvestValue(1)).toBe(15); // 10 + 1 * 5
      expect(calculateHarvestValue(2)).toBe(20); // 10 + 2 * 5
      expect(calculateHarvestValue(3)).toBe(25); // 10 + 3 * 5
    });
  });

  describe('canUseTool', () => {
    it('should allow hoe on grass tiles', () => {
      const grassTile: FarmTile = {
        type: 'grass',
        watered: false,
        planted: false,
        growthStage: 0,
        growthTime: 0,
        maxGrowthTime: 0
      };

      expect(canUseTool(grassTile, 'hoe')).toBe(true);
      expect(canUseTool(grassTile, 'water')).toBe(false);
      expect(canUseTool(grassTile, 'plant')).toBe(false);
      expect(canUseTool(grassTile, 'harvest')).toBe(false);
    });

    it('should allow water on tilled tiles', () => {
      const tilledTile: FarmTile = {
        type: 'tilled',
        watered: false,
        planted: false,
        growthStage: 0,
        growthTime: 0,
        maxGrowthTime: 0
      };

      expect(canUseTool(tilledTile, 'hoe')).toBe(false);
      expect(canUseTool(tilledTile, 'water')).toBe(true);
      expect(canUseTool(tilledTile, 'plant')).toBe(false);
      expect(canUseTool(tilledTile, 'harvest')).toBe(false);
    });

    it('should allow plant on watered tilled tiles', () => {
      const wateredTile: FarmTile = {
        type: 'tilled',
        watered: true,
        planted: false,
        growthStage: 0,
        growthTime: 0,
        maxGrowthTime: 0
      };

      expect(canUseTool(wateredTile, 'hoe')).toBe(false);
      expect(canUseTool(wateredTile, 'water')).toBe(false);
      expect(canUseTool(wateredTile, 'plant')).toBe(true);
      expect(canUseTool(wateredTile, 'harvest')).toBe(false);
    });

    it('should allow harvest on mature planted tiles', () => {
      const matureTile: FarmTile = {
        type: 'planted',
        watered: true,
        planted: true,
        growthStage: 3,
        growthTime: 300,
        maxGrowthTime: 300
      };

      expect(canUseTool(matureTile, 'hoe')).toBe(false);
      expect(canUseTool(matureTile, 'water')).toBe(false);
      expect(canUseTool(matureTile, 'plant')).toBe(false);
      expect(canUseTool(matureTile, 'harvest')).toBe(true);
    });

    it('should not allow harvest on immature planted tiles', () => {
      const immatureTile: FarmTile = {
        type: 'planted',
        watered: true,
        planted: true,
        growthStage: 2,
        growthTime: 200,
        maxGrowthTime: 300
      };

      expect(canUseTool(immatureTile, 'harvest')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });
  });

  describe('validatePlayerData', () => {
    it('should validate correct player data', () => {
      const validData = {
        name: 'Test Farmer',
        bodyType: 'average' as const,
        hairStyle: 'short' as const,
        hairColor: '#8B4513',
        skinTone: '#FDBB7D'
      };

      const result = validatePlayerData(validData);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        bodyType: 'average' as const,
        hairStyle: 'short' as const,
        hairColor: '#8B4513',
        skinTone: '#FDBB7D'
      };

      const result = validatePlayerData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Name is required and must be a non-empty string');
    });

    it('should reject invalid body type', () => {
      const invalidData = {
        name: 'Test Farmer',
        bodyType: 'invalid' as any,
        hairStyle: 'short' as const,
        hairColor: '#8B4513',
        skinTone: '#FDBB7D'
      };

      const result = validatePlayerData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Valid body type is required');
    });

    it('should reject invalid hair style', () => {
      const invalidData = {
        name: 'Test Farmer',
        bodyType: 'average' as const,
        hairStyle: 'invalid' as any,
        hairColor: '#8B4513',
        skinTone: '#FDBB7D'
      };

      const result = validatePlayerData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Valid hair style is required');
    });

    it('should reject missing hair color', () => {
      const invalidData = {
        name: 'Test Farmer',
        bodyType: 'average' as const,
        hairStyle: 'short' as const,
        hairColor: '',
        skinTone: '#FDBB7D'
      };

      const result = validatePlayerData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Valid hair color is required');
    });

    it('should reject missing skin tone', () => {
      const invalidData = {
        name: 'Test Farmer',
        bodyType: 'average' as const,
        hairStyle: 'short' as const,
        hairColor: '#8B4513',
        skinTone: ''
      };

      const result = validatePlayerData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Valid skin tone is required');
    });

    it('should collect all validation errors', () => {
      const invalidData = {
        name: '',
        bodyType: 'invalid' as any,
        hairStyle: 'invalid' as any,
        hairColor: '',
        skinTone: ''
      };

      const result = validatePlayerData(invalidData);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(5);
    });
  });
});

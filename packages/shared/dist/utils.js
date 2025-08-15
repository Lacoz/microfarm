"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFarm = initializeFarm;
exports.screenToTile = screenToTile;
exports.tileToScreen = tileToScreen;
exports.getEnergyCost = getEnergyCost;
exports.calculateHarvestValue = calculateHarvestValue;
exports.canUseTool = canUseTool;
exports.generateId = generateId;
exports.validatePlayerData = validatePlayerData;
const types_1 = require("./types");
/**
 * Initialize a new farm with grass tiles
 */
function initializeFarm(width, height) {
    const tiles = [];
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
function screenToTile(screenX, screenY, centerX, centerY, cameraX, cameraY, farmWidth, farmHeight) {
    const adjustedX = screenX - centerX - cameraX;
    const adjustedY = screenY - centerY - cameraY;
    const tileX = Math.round((adjustedX / (types_1.GAME_CONSTANTS.TILE_WIDTH / 2) + adjustedY / (types_1.GAME_CONSTANTS.TILE_HEIGHT / 2)) / 2);
    const tileY = Math.round((adjustedY / (types_1.GAME_CONSTANTS.TILE_HEIGHT / 2) - adjustedX / (types_1.GAME_CONSTANTS.TILE_WIDTH / 2)) / 2);
    if (tileX >= 0 && tileX < farmWidth && tileY >= 0 && tileY < farmHeight) {
        return { x: tileX, y: tileY };
    }
    return null;
}
/**
 * Convert tile coordinates to screen coordinates in isometric view
 */
function tileToScreen(tileX, tileY, centerX, centerY, cameraX, cameraY) {
    const isoX = centerX + (tileX - tileY) * types_1.GAME_CONSTANTS.TILE_WIDTH / 2 + cameraX;
    const isoY = centerY + (tileX + tileY) * types_1.GAME_CONSTANTS.TILE_HEIGHT / 2 + cameraY;
    return { x: isoX, y: isoY };
}
/**
 * Get energy cost for using a tool
 */
function getEnergyCost(tool) {
    return types_1.GAME_CONSTANTS.ENERGY_COSTS[tool];
}
/**
 * Calculate harvest value based on growth stage
 */
function calculateHarvestValue(growthStage) {
    return 10 + growthStage * 5;
}
/**
 * Check if a tile can be used with a specific tool
 */
function canUseTool(tile, tool) {
    switch (tool) {
        case 'hoe':
            return tile.type === 'grass';
        case 'water':
            return tile.type === 'tilled' && !tile.watered;
        case 'plant':
            return tile.type === 'tilled' && tile.watered && !tile.planted;
        case 'harvest':
            return tile.planted && tile.growthStage >= types_1.GAME_CONSTANTS.GROWTH_STAGES;
        default:
            return false;
    }
}
/**
 * Generate a unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
/**
 * Validate player data
 */
function validatePlayerData(data) {
    const errors = [];
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
//# sourceMappingURL=utils.js.map
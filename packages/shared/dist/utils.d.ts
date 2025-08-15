import { FarmTile, ToolType } from './types';
/**
 * Initialize a new farm with grass tiles
 */
export declare function initializeFarm(width: number, height: number): FarmTile[][];
/**
 * Convert screen coordinates to tile coordinates in isometric view
 */
export declare function screenToTile(screenX: number, screenY: number, centerX: number, centerY: number, cameraX: number, cameraY: number, farmWidth: number, farmHeight: number): {
    x: number;
    y: number;
} | null;
/**
 * Convert tile coordinates to screen coordinates in isometric view
 */
export declare function tileToScreen(tileX: number, tileY: number, centerX: number, centerY: number, cameraX: number, cameraY: number): {
    x: number;
    y: number;
};
/**
 * Get energy cost for using a tool
 */
export declare function getEnergyCost(tool: ToolType): number;
/**
 * Calculate harvest value based on growth stage
 */
export declare function calculateHarvestValue(growthStage: number): number;
/**
 * Check if a tile can be used with a specific tool
 */
export declare function canUseTool(tile: FarmTile, tool: ToolType): boolean;
/**
 * Generate a unique ID
 */
export declare function generateId(): string;
/**
 * Validate player data
 */
export declare function validatePlayerData(data: any): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=utils.d.ts.map
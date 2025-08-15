export interface Player {
    id: string;
    name: string;
    bodyType: BodyType;
    hairStyle: HairStyle;
    hairColor: string;
    skinTone: string;
    createdAt: Date;
    lastActive: Date;
}
export type BodyType = 'slim' | 'average' | 'sturdy';
export type HairStyle = 'short' | 'long' | 'curly' | 'bald';
export interface GameState {
    player: Player;
    game: GameData;
    farm: Farm;
    camera: Camera;
}
export interface GameData {
    day: number;
    money: number;
    energy: number;
    maxEnergy: number;
    seeds: number;
    currentTool: ToolType;
}
export interface Farm {
    tiles: FarmTile[][];
    width: number;
    height: number;
}
export interface FarmTile {
    type: TileType;
    watered: boolean;
    planted: boolean;
    growthStage: number;
    growthTime: number;
    maxGrowthTime: number;
    lastWatered?: Date;
}
export type TileType = 'grass' | 'tilled' | 'watered' | 'planted';
export type ToolType = 'hoe' | 'water' | 'plant' | 'harvest';
export interface Camera {
    x: number;
    y: number;
}
export interface GameEvent {
    type: string;
    playerId: string;
    timestamp: Date;
    data: any;
}
export interface ToolUseEvent extends GameEvent {
    type: 'tool_use';
    data: {
        tool: ToolType;
        tileX: number;
        tileY: number;
        success: boolean;
        energyCost: number;
    };
}
export interface CropHarvestEvent extends GameEvent {
    type: 'crop_harvest';
    data: {
        tileX: number;
        tileY: number;
        harvestValue: number;
        cropType: string;
    };
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface CreatePlayerRequest {
    name: string;
    bodyType: BodyType;
    hairStyle: HairStyle;
    hairColor: string;
    skinTone: string;
}
export interface UpdateGameStateRequest {
    playerId: string;
    gameState: Partial<GameState>;
}
export declare const GAME_CONSTANTS: {
    readonly TILE_WIDTH: 32;
    readonly TILE_HEIGHT: 16;
    readonly INITIAL_MONEY: 100;
    readonly INITIAL_ENERGY: 100;
    readonly INITIAL_SEEDS: 5;
    readonly ENERGY_COSTS: {
        readonly hoe: 5;
        readonly water: 3;
        readonly plant: 2;
        readonly harvest: 3;
    };
    readonly GROWTH_STAGES: 3;
    readonly GROWTH_TIME: 300;
};
//# sourceMappingURL=types.d.ts.map
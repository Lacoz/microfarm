"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const uuid_1 = require("uuid");
const shared_1 = require("@microfarm/shared");
const shared_2 = require("@microfarm/shared");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// In-memory storage (in production, use a database)
const players = new Map();
const gameStates = new Map();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
// Initialize a new game state for a player
function createGameState(player) {
    return {
        player,
        game: {
            day: 1,
            money: shared_1.GAME_CONSTANTS.INITIAL_MONEY,
            energy: shared_1.GAME_CONSTANTS.INITIAL_ENERGY,
            maxEnergy: shared_1.GAME_CONSTANTS.INITIAL_ENERGY,
            seeds: shared_1.GAME_CONSTANTS.INITIAL_SEEDS,
            currentTool: 'hoe'
        },
        farm: {
            tiles: (0, shared_2.initializeFarm)(20, 15),
            width: 20,
            height: 15
        },
        camera: {
            x: 0,
            y: 0
        }
    };
}
// Routes
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Create a new player
app.post('/api/players', (req, res) => {
    try {
        const playerData = req.body;
        // Validate player data
        const validation = (0, shared_2.validatePlayerData)(playerData);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                error: 'Invalid player data',
                details: validation.errors
            });
        }
        // Create player
        const player = {
            id: (0, uuid_1.v4)(),
            name: playerData.name.trim(),
            bodyType: playerData.bodyType,
            hairStyle: playerData.hairStyle,
            hairColor: playerData.hairColor,
            skinTone: playerData.skinTone,
            createdAt: new Date(),
            lastActive: new Date()
        };
        // Store player
        players.set(player.id, player);
        // Create initial game state
        const gameState = createGameState(player);
        gameStates.set(player.id, gameState);
        res.status(201).json({
            success: true,
            data: { player, gameState }
        });
    }
    catch (error) {
        console.error('Error creating player:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Get player and game state
app.get('/api/players/:playerId', (req, res) => {
    try {
        const { playerId } = req.params;
        const player = players.get(playerId);
        if (!player) {
            return res.status(404).json({
                success: false,
                error: 'Player not found'
            });
        }
        const gameState = gameStates.get(playerId);
        if (!gameState) {
            return res.status(404).json({
                success: false,
                error: 'Game state not found'
            });
        }
        // Update last active
        player.lastActive = new Date();
        res.json({
            success: true,
            data: { player, gameState }
        });
    }
    catch (error) {
        console.error('Error getting player:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Use tool on farm tile
app.post('/api/players/:playerId/use-tool', (req, res) => {
    try {
        const { playerId } = req.params;
        const { tool, tileX, tileY } = req.body;
        const gameState = gameStates.get(playerId);
        if (!gameState) {
            return res.status(404).json({
                success: false,
                error: 'Game state not found'
            });
        }
        // Validate coordinates
        if (tileX < 0 || tileX >= gameState.farm.width || tileY < 0 || tileY >= gameState.farm.height) {
            return res.status(400).json({
                success: false,
                error: 'Invalid tile coordinates'
            });
        }
        const tile = gameState.farm.tiles[tileY][tileX];
        const energyCost = (0, shared_2.getEnergyCost)(tool);
        // Check if player has enough energy
        if (gameState.game.energy < energyCost) {
            return res.status(400).json({
                success: false,
                error: 'Not enough energy'
            });
        }
        // Check if tool can be used on this tile
        if (!(0, shared_2.canUseTool)(tile, tool)) {
            return res.status(400).json({
                success: false,
                error: 'Cannot use this tool on this tile'
            });
        }
        // Apply tool effect
        let success = false;
        let harvestValue = 0;
        switch (tool) {
            case 'hoe':
                if (tile.type === 'grass') {
                    tile.type = 'tilled';
                    success = true;
                }
                break;
            case 'water':
                if (tile.type === 'tilled' && !tile.watered) {
                    tile.watered = true;
                    tile.lastWatered = new Date();
                    success = true;
                }
                break;
            case 'plant':
                if (tile.type === 'tilled' && tile.watered && !tile.planted && gameState.game.seeds > 0) {
                    tile.planted = true;
                    tile.growthStage = 1;
                    tile.growthTime = 0;
                    tile.maxGrowthTime = shared_1.GAME_CONSTANTS.GROWTH_TIME;
                    gameState.game.seeds--;
                    success = true;
                }
                break;
            case 'harvest':
                if (tile.planted && tile.growthStage >= shared_1.GAME_CONSTANTS.GROWTH_STAGES) {
                    harvestValue = (0, shared_2.calculateHarvestValue)(tile.growthStage);
                    gameState.game.money += harvestValue;
                    tile.planted = false;
                    tile.growthStage = 0;
                    tile.watered = false;
                    tile.type = 'grass';
                    success = true;
                }
                break;
        }
        if (success) {
            gameState.game.energy -= energyCost;
            gameState.game.currentTool = tool;
            // Update last active
            const player = players.get(playerId);
            if (player) {
                player.lastActive = new Date();
            }
        }
        res.json({
            success: true,
            data: {
                success,
                energyCost,
                harvestValue,
                gameState
            }
        });
    }
    catch (error) {
        console.error('Error using tool:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Update game state (for camera movement, etc.)
app.put('/api/players/:playerId/game-state', (req, res) => {
    try {
        const { playerId } = req.params;
        const updateData = req.body;
        const gameState = gameStates.get(playerId);
        if (!gameState) {
            return res.status(404).json({
                success: false,
                error: 'Game state not found'
            });
        }
        // Update allowed fields
        if (updateData.gameState.camera) {
            gameState.camera = { ...gameState.camera, ...updateData.gameState.camera };
        }
        if (updateData.gameState.game?.currentTool) {
            gameState.game.currentTool = updateData.gameState.game.currentTool;
        }
        // Update last active
        const player = players.get(playerId);
        if (player) {
            player.lastActive = new Date();
        }
        res.json({
            success: true,
            data: { gameState }
        });
    }
    catch (error) {
        console.error('Error updating game state:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Update crop growth (called periodically)
app.post('/api/players/:playerId/update-crops', (req, res) => {
    try {
        const { playerId } = req.params;
        const gameState = gameStates.get(playerId);
        if (!gameState) {
            return res.status(404).json({
                success: false,
                error: 'Game state not found'
            });
        }
        // Update crop growth
        for (let y = 0; y < gameState.farm.height; y++) {
            for (let x = 0; x < gameState.farm.width; x++) {
                const tile = gameState.farm.tiles[y][x];
                if (tile.planted && tile.growthStage < shared_1.GAME_CONSTANTS.GROWTH_STAGES) {
                    tile.growthTime++;
                    if (tile.growthTime >= tile.maxGrowthTime) {
                        tile.growthStage++;
                        tile.growthTime = 0;
                    }
                }
            }
        }
        res.json({
            success: true,
            data: { gameState }
        });
    }
    catch (error) {
        console.error('Error updating crops:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
// Start server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 MicroFarm Backend Server running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
}
// Export for testing
exports.default = app;
//# sourceMappingURL=index.js.map
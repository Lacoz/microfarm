// Game state
let gameState = {
    currentScreen: 'character-creation',
    player: {
        name: 'Farmer',
        bodyType: 'average',
        hairStyle: 'short',
        hairColor: '#8B4513',
        skinTone: '#FDBB7D'
    },
    game: {
        day: 1,
        money: 100,
        energy: 100,
        maxEnergy: 100,
        seeds: 5,
        currentTool: 'hoe'
    },
    farm: {
        tiles: [],
        width: 20,
        height: 15
    },
    camera: {
        x: 0,
        y: 0
    }
};

// Canvas contexts
let characterPreviewCtx;
let gameCtx;

// Isometric tile size
const TILE_WIDTH = 32;
const TILE_HEIGHT = 16;

// Initialize the game
function init() {
    // Get canvas contexts
    const characterPreviewCanvas = document.getElementById('character-preview-canvas');
    const gameCanvas = document.getElementById('game-canvas');
    
    characterPreviewCtx = characterPreviewCanvas.getContext('2d');
    gameCtx = gameCanvas.getContext('2d');
    
    // Initialize farm tiles
    initializeFarm();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start the game loop
    gameLoop();
}

// Initialize farm tiles
function initializeFarm() {
    gameState.farm.tiles = [];
    for (let y = 0; y < gameState.farm.height; y++) {
        gameState.farm.tiles[y] = [];
        for (let x = 0; x < gameState.farm.width; x++) {
            gameState.farm.tiles[y][x] = {
                type: 'grass',
                watered: false,
                planted: false,
                growthStage: 0,
                growthTime: 0,
                maxGrowthTime: 0
            };
        }
    }
}

// Set up event listeners
function setupEventListeners() {
    // Character creation events
    document.getElementById('farmer-name').addEventListener('input', updateCharacterPreview);
    
    // Body type buttons
    document.querySelectorAll('[data-body]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-body]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            gameState.player.bodyType = e.target.dataset.body;
            updateCharacterPreview();
        });
    });
    
    // Hair style buttons
    document.querySelectorAll('[data-hair]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-hair]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            gameState.player.hairStyle = e.target.dataset.hair;
            updateCharacterPreview();
        });
    });
    
    // Hair color buttons
    document.querySelectorAll('[data-color]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            gameState.player.hairColor = e.target.dataset.color;
            updateCharacterPreview();
        });
    });
    
    // Skin tone buttons
    document.querySelectorAll('[data-skin]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-skin]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            gameState.player.skinTone = e.target.dataset.skin;
            updateCharacterPreview();
        });
    });
    
    // Start game button
    document.getElementById('start-game-btn').addEventListener('click', startGame);
    
    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            gameState.game.currentTool = e.target.id.replace('-btn', '');
        });
    });
    
    // Game canvas events
    const gameCanvas = document.getElementById('game-canvas');
    gameCanvas.addEventListener('click', handleCanvasClick);
    gameCanvas.addEventListener('mousemove', handleCanvasMouseMove);
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyPress);
    
    // Initial character preview
    updateCharacterPreview();
}

// Update character preview
function updateCharacterPreview() {
    const name = document.getElementById('farmer-name').value;
    gameState.player.name = name || 'Farmer';
    
    // Clear canvas
    characterPreviewCtx.clearRect(0, 0, 200, 200);
    
    // Draw character based on customization
    drawCharacter(characterPreviewCtx, 100, 150, gameState.player);
}

// Draw character
function drawCharacter(ctx, x, y, player) {
    const { bodyType, hairStyle, hairColor, skinTone } = player;
    
    // Body
    ctx.fillStyle = skinTone;
    let bodyWidth = 20;
    let bodyHeight = 30;
    
    if (bodyType === 'slim') {
        bodyWidth = 16;
        bodyHeight = 28;
    } else if (bodyType === 'sturdy') {
        bodyWidth = 24;
        bodyHeight = 32;
    }
    
    ctx.fillRect(x - bodyWidth/2, y - bodyHeight, bodyWidth, bodyHeight);
    
    // Head
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.arc(x, y - bodyHeight - 15, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair
    ctx.fillStyle = hairColor;
    if (hairStyle === 'short') {
        ctx.fillRect(x - 12, y - bodyHeight - 25, 24, 8);
    } else if (hairStyle === 'long') {
        ctx.fillRect(x - 12, y - bodyHeight - 25, 24, 15);
    } else if (hairStyle === 'curly') {
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(x - 8 + i * 4, y - bodyHeight - 20 + (i % 2) * 3, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    // Bald style - no hair drawn
    
    // Eyes
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x - 5, y - bodyHeight - 18, 2, 0, Math.PI * 2);
    ctx.arc(x + 5, y - bodyHeight - 18, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y - bodyHeight - 8, 3, 0, Math.PI);
    ctx.stroke();
    
    // Arms
    ctx.fillStyle = skinTone;
    ctx.fillRect(x - bodyWidth/2 - 8, y - bodyHeight + 5, 6, 20);
    ctx.fillRect(x + bodyWidth/2 + 2, y - bodyHeight + 5, 6, 20);
    
    // Legs
    ctx.fillRect(x - bodyWidth/2, y - 5, 6, 25);
    ctx.fillRect(x + bodyWidth/2 - 6, y - 5, 6, 25);
}

// Start the game
function startGame() {
    if (!gameState.player.name.trim()) {
        alert('Please enter a name for your farmer!');
        return;
    }
    
    // Switch screens
    document.getElementById('character-creation').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    gameState.currentScreen = 'game';
    
    // Update UI
    updateGameUI();
    
    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Update game UI
function updateGameUI() {
    document.getElementById('player-name').textContent = gameState.player.name;
    document.getElementById('day-counter').textContent = `Day ${gameState.game.day}`;
    document.getElementById('money').textContent = `$${gameState.game.money}`;
    document.getElementById('energy').textContent = `Energy: ${gameState.game.energy}/${gameState.game.maxEnergy}`;
    document.getElementById('seed-count').textContent = gameState.game.seeds;
}

// Game loop
function gameLoop() {
    if (gameState.currentScreen === 'game') {
        renderGame();
        updateGame();
        requestAnimationFrame(gameLoop);
    }
}

// Render the game
function renderGame() {
    // Clear canvas
    gameCtx.clearRect(0, 0, 800, 600);
    
    // Draw farm tiles
    drawFarm();
    
    // Draw player
    drawPlayer();
}

// Draw farm tiles
function drawFarm() {
    const centerX = 400;
    const centerY = 300;
    
    for (let y = 0; y < gameState.farm.height; y++) {
        for (let x = 0; x < gameState.farm.width; x++) {
            const tile = gameState.farm.tiles[y][x];
            const isoX = centerX + (x - y) * TILE_WIDTH / 2 + gameState.camera.x;
            const isoY = centerY + (x + y) * TILE_HEIGHT / 2 + gameState.camera.y;
            
            // Skip tiles outside view
            if (isoX < -50 || isoX > 850 || isoY < -50 || isoY > 650) continue;
            
            drawTile(isoX, isoY, tile);
        }
    }
}

// Draw a single tile
function drawTile(x, y, tile) {
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
    gameCtx.fillStyle = color;
    gameCtx.strokeStyle = '#2F4F2F';
    gameCtx.lineWidth = 1;
    
    gameCtx.beginPath();
    gameCtx.moveTo(x, y - TILE_HEIGHT);
    gameCtx.lineTo(x + TILE_WIDTH/2, y);
    gameCtx.lineTo(x, y + TILE_HEIGHT);
    gameCtx.lineTo(x - TILE_WIDTH/2, y);
    gameCtx.closePath();
    gameCtx.fill();
    gameCtx.stroke();
    
    // Draw crop if planted
    if (tile.planted && tile.growthStage > 0) {
        drawCrop(x, y, tile.growthStage);
    }
}

// Draw crop
function drawCrop(x, y, growthStage) {
    const colors = ['#228B22', '#32CD32', '#FFD700'];
    const color = colors[Math.min(growthStage - 1, colors.length - 1)];
    
    gameCtx.fillStyle = color;
    gameCtx.beginPath();
    gameCtx.arc(x, y - TILE_HEIGHT/2, 3 + growthStage * 2, 0, Math.PI * 2);
    gameCtx.fill();
}

// Draw player
function drawPlayer() {
    const centerX = 400;
    const centerY = 300;
    const playerX = centerX + gameState.camera.x;
    const playerY = centerY + gameState.camera.y;
    
    drawCharacter(gameCtx, playerX, playerY, gameState.player);
}

// Update game state
function updateGame() {
    // Update crop growth
    for (let y = 0; y < gameState.farm.height; y++) {
        for (let x = 0; x < gameState.farm.width; x++) {
            const tile = gameState.farm.tiles[y][x];
            if (tile.planted && tile.growthStage < 3) {
                tile.growthTime++;
                if (tile.growthTime >= tile.maxGrowthTime) {
                    tile.growthStage++;
                    tile.growthTime = 0;
                }
            }
        }
    }
}

// Handle canvas click
function handleCanvasClick(e) {
    if (gameState.currentScreen !== 'game') return;
    
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Convert screen coordinates to tile coordinates
    const tileCoords = screenToTile(x, y);
    if (tileCoords) {
        useTool(tileCoords.x, tileCoords.y);
    }
}

// Handle canvas mouse move
function handleCanvasMouseMove(e) {
    if (gameState.currentScreen !== 'game') return;
    
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update cursor based on tool
    const tileCoords = screenToTile(x, y);
    if (tileCoords) {
        e.target.style.cursor = 'pointer';
    } else {
        e.target.style.cursor = 'crosshair';
    }
}

// Convert screen coordinates to tile coordinates
function screenToTile(screenX, screenY) {
    const centerX = 400;
    const centerY = 300;
    
    // Adjust for camera
    const adjustedX = screenX - centerX - gameState.camera.x;
    const adjustedY = screenY - centerY - gameState.camera.y;
    
    // Convert to tile coordinates
    const tileX = Math.round((adjustedX / (TILE_WIDTH / 2) + adjustedY / (TILE_HEIGHT / 2)) / 2);
    const tileY = Math.round((adjustedY / (TILE_HEIGHT / 2) - adjustedX / (TILE_WIDTH / 2)) / 2);
    
    if (tileX >= 0 && tileX < gameState.farm.width && tileY >= 0 && tileY < gameState.farm.height) {
        return { x: tileX, y: tileY };
    }
    return null;
}

// Use tool on tile
function useTool(tileX, tileY) {
    if (gameState.game.energy <= 0) {
        alert('You are too tired! Rest to regain energy.');
        return;
    }
    
    const tile = gameState.farm.tiles[tileY][tileX];
    const tool = gameState.game.currentTool;
    
    switch (tool) {
        case 'hoe':
            if (tile.type === 'grass') {
                tile.type = 'tilled';
                gameState.game.energy -= 5;
            }
            break;
        case 'water':
            if (tile.type === 'tilled' && !tile.watered) {
                tile.watered = true;
                gameState.game.energy -= 3;
            }
            break;
        case 'plant':
            if (tile.type === 'tilled' && tile.watered && !tile.planted && gameState.game.seeds > 0) {
                tile.planted = true;
                tile.growthStage = 1;
                tile.growthTime = 0;
                tile.maxGrowthTime = 300; // 5 seconds at 60fps
                gameState.game.seeds--;
                gameState.game.energy -= 2;
            }
            break;
        case 'harvest':
            if (tile.planted && tile.growthStage >= 3) {
                const harvestValue = 10 + tile.growthStage * 5;
                gameState.game.money += harvestValue;
                tile.planted = false;
                tile.growthStage = 0;
                tile.watered = false;
                tile.type = 'grass';
                gameState.game.energy -= 3;
            }
            break;
    }
    
    updateGameUI();
}

// Handle key press
function handleKeyPress(e) {
    if (gameState.currentScreen !== 'game') return;
    
    switch (e.key.toLowerCase()) {
        case 'h':
            document.getElementById('hoe-btn').click();
            break;
        case 'w':
            document.getElementById('water-btn').click();
            break;
        case 'p':
            document.getElementById('plant-btn').click();
            break;
        case 'g':
            document.getElementById('harvest-btn').click();
            break;
        case 'arrowup':
        case 'w':
            gameState.camera.y += 10;
            break;
        case 'arrowdown':
        case 's':
            gameState.camera.y -= 10;
            break;
        case 'arrowleft':
        case 'a':
            gameState.camera.x += 10;
            break;
        case 'arrowright':
        case 'd':
            gameState.camera.x -= 10;
            break;
    }
}

// Initialize the game when the page loads
window.addEventListener('load', init);

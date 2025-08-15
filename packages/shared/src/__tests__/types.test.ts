import { 
  Player, 
  GameState, 
  FarmTile, 
  ToolType, 
  TileType, 
  BodyType, 
  HairStyle,
  GAME_CONSTANTS 
} from '../types';

describe('Game Types', () => {
  describe('Player Interface', () => {
    it('should create a valid player object', () => {
      const player: Player = {
        id: 'test-id',
        name: 'Test Farmer',
        bodyType: 'average',
        hairStyle: 'short',
        hairColor: '#8B4513',
        skinTone: '#FDBB7D',
        createdAt: new Date(),
        lastActive: new Date()
      };

      expect(player.id).toBe('test-id');
      expect(player.name).toBe('Test Farmer');
      expect(player.bodyType).toBe('average');
      expect(player.hairStyle).toBe('short');
      expect(player.hairColor).toBe('#8B4513');
      expect(player.skinTone).toBe('#FDBB7D');
      expect(player.createdAt).toBeInstanceOf(Date);
      expect(player.lastActive).toBeInstanceOf(Date);
    });
  });

  describe('GameState Interface', () => {
    it('should create a valid game state object', () => {
      const player: Player = {
        id: 'test-id',
        name: 'Test Farmer',
        bodyType: 'average',
        hairStyle: 'short',
        hairColor: '#8B4513',
        skinTone: '#FDBB7D',
        createdAt: new Date(),
        lastActive: new Date()
      };

      const gameState: GameState = {
        player,
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

      expect(gameState.player).toBe(player);
      expect(gameState.game.day).toBe(1);
      expect(gameState.game.money).toBe(100);
      expect(gameState.game.energy).toBe(100);
      expect(gameState.game.currentTool).toBe('hoe');
      expect(gameState.farm.width).toBe(20);
      expect(gameState.farm.height).toBe(15);
      expect(gameState.camera.x).toBe(0);
      expect(gameState.camera.y).toBe(0);
    });
  });

  describe('FarmTile Interface', () => {
    it('should create a valid farm tile object', () => {
      const tile: FarmTile = {
        type: 'grass',
        watered: false,
        planted: false,
        growthStage: 0,
        growthTime: 0,
        maxGrowthTime: 0
      };

      expect(tile.type).toBe('grass');
      expect(tile.watered).toBe(false);
      expect(tile.planted).toBe(false);
      expect(tile.growthStage).toBe(0);
      expect(tile.growthTime).toBe(0);
      expect(tile.maxGrowthTime).toBe(0);
    });

    it('should create a planted tile', () => {
      const plantedTile: FarmTile = {
        type: 'planted',
        watered: true,
        planted: true,
        growthStage: 2,
        growthTime: 150,
        maxGrowthTime: 300,
        lastWatered: new Date()
      };

      expect(plantedTile.type).toBe('planted');
      expect(plantedTile.watered).toBe(true);
      expect(plantedTile.planted).toBe(true);
      expect(plantedTile.growthStage).toBe(2);
      expect(plantedTile.lastWatered).toBeInstanceOf(Date);
    });
  });

  describe('Type Unions', () => {
    it('should accept valid tool types', () => {
      const tools: ToolType[] = ['hoe', 'water', 'plant', 'harvest'];
      
      tools.forEach(tool => {
        expect(['hoe', 'water', 'plant', 'harvest']).toContain(tool);
      });
    });

    it('should accept valid tile types', () => {
      const tileTypes: TileType[] = ['grass', 'tilled', 'watered', 'planted'];
      
      tileTypes.forEach(type => {
        expect(['grass', 'tilled', 'watered', 'planted']).toContain(type);
      });
    });

    it('should accept valid body types', () => {
      const bodyTypes: BodyType[] = ['slim', 'average', 'sturdy'];
      
      bodyTypes.forEach(type => {
        expect(['slim', 'average', 'sturdy']).toContain(type);
      });
    });

    it('should accept valid hair styles', () => {
      const hairStyles: HairStyle[] = ['short', 'long', 'curly', 'bald'];
      
      hairStyles.forEach(style => {
        expect(['short', 'long', 'curly', 'bald']).toContain(style);
      });
    });
  });

  describe('GAME_CONSTANTS', () => {
    it('should have correct tile dimensions', () => {
      expect(GAME_CONSTANTS.TILE_WIDTH).toBe(32);
      expect(GAME_CONSTANTS.TILE_HEIGHT).toBe(16);
    });

    it('should have correct initial values', () => {
      expect(GAME_CONSTANTS.INITIAL_MONEY).toBe(100);
      expect(GAME_CONSTANTS.INITIAL_ENERGY).toBe(100);
      expect(GAME_CONSTANTS.INITIAL_SEEDS).toBe(5);
    });

    it('should have correct energy costs', () => {
      expect(GAME_CONSTANTS.ENERGY_COSTS.hoe).toBe(5);
      expect(GAME_CONSTANTS.ENERGY_COSTS.water).toBe(3);
      expect(GAME_CONSTANTS.ENERGY_COSTS.plant).toBe(2);
      expect(GAME_CONSTANTS.ENERGY_COSTS.harvest).toBe(3);
    });

    it('should have correct growth settings', () => {
      expect(GAME_CONSTANTS.GROWTH_STAGES).toBe(3);
      expect(GAME_CONSTANTS.GROWTH_TIME).toBe(300);
    });
  });
});

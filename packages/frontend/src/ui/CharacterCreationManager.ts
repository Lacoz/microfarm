import type { Player, BodyType, HairStyle, CreatePlayerRequest } from '@microfarm/shared';
import { GameManager } from '../game/GameManager';
import { CharacterRenderer } from '../renderers/CharacterRenderer';

export class CharacterCreationManager {
  private characterRenderer: CharacterRenderer;
  private currentPlayer: Partial<Player> = {
    name: 'Farmer',
    bodyType: 'average',
    hairStyle: 'short',
    hairColor: '#8B4513',
    skinTone: '#FDBB7D'
  };

  constructor() {
    this.characterRenderer = new CharacterRenderer();
  }

  init(gameManager: GameManager): void {
    this.setupEventListeners(gameManager);
    this.updateCharacterPreview();
  }

  private setupEventListeners(gameManager: GameManager): void {
    // Name input
    const nameInput = document.getElementById('farmer-name') as HTMLInputElement;
    nameInput.addEventListener('input', (e) => {
      this.currentPlayer.name = (e.target as HTMLInputElement).value || 'Farmer';
      this.updateCharacterPreview();
    });

    // Body type buttons
    document.querySelectorAll('[data-body]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-body]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentPlayer.bodyType = (e.target as HTMLElement).dataset.body as BodyType;
        this.updateCharacterPreview();
      });
    });

    // Hair style buttons
    document.querySelectorAll('[data-hair]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-hair]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentPlayer.hairStyle = (e.target as HTMLElement).dataset.hair as HairStyle;
        this.updateCharacterPreview();
      });
    });

    // Hair color buttons
    document.querySelectorAll('[data-color]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-color]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentPlayer.hairColor = (e.target as HTMLElement).dataset.color!;
        this.updateCharacterPreview();
      });
    });

    // Skin tone buttons
    document.querySelectorAll('[data-skin]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-skin]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentPlayer.skinTone = (e.target as HTMLElement).dataset.skin!;
        this.updateCharacterPreview();
      });
    });

    // Start game button
    const startButton = document.getElementById('start-game-btn');
    startButton.addEventListener('click', async () => {
      await this.startGame(gameManager);
    });
  }

  private updateCharacterPreview(): void {
    const canvas = document.getElementById('character-preview-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw character
    this.characterRenderer.drawCharacter(ctx, 100, 150, this.currentPlayer as Player);
  }

  private async startGame(gameManager: GameManager): Promise<void> {
    if (!this.currentPlayer.name?.trim()) {
      alert('Please enter a name for your farmer!');
      return;
    }

    try {
      const playerData: CreatePlayerRequest = {
        name: this.currentPlayer.name,
        bodyType: this.currentPlayer.bodyType!,
        hairStyle: this.currentPlayer.hairStyle!,
        hairColor: this.currentPlayer.hairColor!,
        skinTone: this.currentPlayer.skinTone!
      };

      await gameManager.startGame(playerData);
    } catch (error) {
      console.error('Failed to start game:', error);
      alert('Failed to start game. Please try again.');
    }
  }
}

import { GameManager } from './game/GameManager';
import { CharacterCreationManager } from './ui/CharacterCreationManager';
import { UIManager } from './ui/UIManager';
import { ApiService } from './services/ApiService';

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const apiService = new ApiService();
  const characterCreationManager = new CharacterCreationManager();
  const uiManager = new UIManager();
  const gameManager = new GameManager(apiService, uiManager);

  // Start the application
  characterCreationManager.init(gameManager);
});

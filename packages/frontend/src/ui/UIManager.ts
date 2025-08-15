import { GameState } from '@microfarm/shared';

export class UIManager {
  updateGameUI(gameState: GameState): void {
    // Update player info
    const playerNameElement = document.getElementById('player-name');
    const dayCounterElement = document.getElementById('day-counter');
    const moneyElement = document.getElementById('money');
    const energyElement = document.getElementById('energy');
    const seedCountElement = document.getElementById('seed-count');

    if (playerNameElement) {
      playerNameElement.textContent = gameState.player.name;
    }
    if (dayCounterElement) {
      dayCounterElement.textContent = `Day ${gameState.game.day}`;
    }
    if (moneyElement) {
      moneyElement.textContent = `$${gameState.game.money}`;
    }
    if (energyElement) {
      energyElement.textContent = `Energy: ${gameState.game.energy}/${gameState.game.maxEnergy}`;
    }
    if (seedCountElement) {
      seedCountElement.textContent = gameState.game.seeds.toString();
    }
  }

  switchToGameScreen(): void {
    const characterCreationScreen = document.getElementById('character-creation');
    const gameScreen = document.getElementById('game-screen');

    if (characterCreationScreen && gameScreen) {
      characterCreationScreen.classList.remove('active');
      gameScreen.classList.add('active');
    }
  }

  setActiveTool(tool: string): void {
    // Remove active class from all tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Add active class to the selected tool
    const toolButton = document.getElementById(`${tool}-btn`);
    if (toolButton) {
      toolButton.classList.add('active');
    }
  }

  showMessage(message: string, type: 'info' | 'error' | 'success' = 'info'): void {
    // Create a simple message display
    const messageDiv = document.createElement('div');
    messageDiv.className = `game-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;

    // Set background color based on type
    switch (type) {
      case 'error':
        messageDiv.style.backgroundColor = '#e74c3c';
        break;
      case 'success':
        messageDiv.style.backgroundColor = '#27ae60';
        break;
      default:
        messageDiv.style.backgroundColor = '#3498db';
    }

    document.body.appendChild(messageDiv);

    // Remove message after 3 seconds
    setTimeout(() => {
      messageDiv.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.parentNode.removeChild(messageDiv);
        }
      }, 300);
    }, 3000);
  }

  setupToolButtons(onToolSelect: (tool: string) => void): void {
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tool = (e.target as HTMLElement).id.replace('-btn', '');
        this.setActiveTool(tool);
        onToolSelect(tool);
      });
    });
  }

  setupKeyboardControls(
    onToolSelect: (tool: string) => void,
    onCameraMove: (direction: string) => void
  ): void {
    document.addEventListener('keydown', (e) => {
      switch (e.key.toLowerCase()) {
        case 'h':
          this.setActiveTool('hoe');
          onToolSelect('hoe');
          break;
        case 'w':
          this.setActiveTool('water');
          onToolSelect('water');
          break;
        case 'p':
          this.setActiveTool('plant');
          onToolSelect('plant');
          break;
        case 'g':
          this.setActiveTool('harvest');
          onToolSelect('harvest');
          break;
        case 'arrowup':
          onCameraMove('up');
          break;
        case 'arrowdown':
        case 's':
          onCameraMove('down');
          break;
        case 'arrowleft':
        case 'a':
          onCameraMove('left');
          break;
        case 'arrowright':
        case 'd':
          onCameraMove('right');
          break;
      }
    });
  }
}

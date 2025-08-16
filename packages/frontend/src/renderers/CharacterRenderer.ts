import type { Player } from '@microfarm/shared';

export class CharacterRenderer {
  drawCharacter(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    player: Player,
    facing: 'up' | 'down' | 'left' | 'right' = 'down',
    running: boolean = false
  ): void {
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
    
    // Eyes based on facing
    ctx.fillStyle = '#000';
    ctx.beginPath();
    const eyeOffsetX = facing === 'left' ? -2 : facing === 'right' ? 2 : 0;
    ctx.arc(x - 5 + eyeOffsetX, y - bodyHeight - 18, 2, 0, Math.PI * 2);
    ctx.arc(x + 5 + eyeOffsetX, y - bodyHeight - 18, 2, 0, Math.PI * 2);
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
    
    // Legs (simple run animation: alternate leg y-offset)
    const runOffset = running ? Math.sin(Date.now() / 100) * 4 : 0;
    ctx.fillRect(x - bodyWidth/2, y - 5 + runOffset, 6, 25);
    ctx.fillRect(x + bodyWidth/2 - 6, y - 5 - runOffset, 6, 25);
  }
}

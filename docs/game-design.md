# MicroFarm Game Design

## Core Loop
- Create a character → Manage energy and seeds → Perform actions on tiles → Crops grow over time → Harvest for money → Repeat.

## Time & Progression
- Real-time growth: crops update periodically every 10 seconds via a background tick.
- Day counter increases based on player activity (actions) and elapsed growth ticks.

## Player Actions
- Tools:
  - Hoe: till grass
  - Water: water tilled soil
  - Plant: plant seeds on watered soil
  - Harvest: collect mature crops
- Energy cost per action; energy and seeds shown in UI.

## World & Camera
- Isometric grid rendered on canvas.
- Player stays centered; camera scrolls the farm using Arrow Keys / WASD.

## Interactivity
- Click a tile to use the currently selected tool.
- Keyboard shortcuts: H (hoe), W (water), P (plant), G (harvest), Arrows/WASD (camera).

## Backend API
- Stateless HTTP endpoints for player, game state, and crop updates.
- `POST /api/players/:id/update-crops` is called by the client every 10 seconds to advance growth.

## Future Enhancements
- Weather effects (impacting growth)
- NPCs and quests
- Buildings and crafting
- Save/Load profiles and cloud sync

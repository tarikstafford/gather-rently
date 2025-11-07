import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

// Gather Walls 3.1: Walls and barriers
const width = 1024
const height = 1024
const url = '/sprites/spritesheets/gather_walls_3.1.png'

// Generate tiles programmatically for the grid
const sprites: SpriteSheetTile[] = []
const columns = 32
const rows = 32
const tileSize = 32

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const index = row * columns + col
        sprites.push({
            name: `wall_${index}`,
            x: col * tileSize,
            y: row * tileSize,
            width: tileSize,
            height: tileSize,
            layer: 'object',
            colliders: [{ x: 0, y: 0 }]
        })
    }
}

const gatherWallsSpriteSheetData = new SpriteSheetData(width, height, url, sprites)

export { gatherWallsSpriteSheetData }

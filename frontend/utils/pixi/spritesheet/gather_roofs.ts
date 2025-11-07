import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

// Gather Roofs 3.x: Calculate dimensions from the image
const width = 512  // Will be updated after checking actual image size
const height = 512
const url = '/sprites/spritesheets/gather_roofs_3.x.png'

// Generate tiles programmatically for the grid
const sprites: SpriteSheetTile[] = []
const columns = 16
const rows = 16
const tileSize = 32

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const index = row * columns + col
        sprites.push({
            name: `roof_${index}`,
            x: col * tileSize,
            y: row * tileSize,
            width: tileSize,
            height: tileSize,
            layer: 'object'
        })
    }
}

const gatherRoofsSpriteSheetData = new SpriteSheetData(width, height, url, sprites)

export { gatherRoofsSpriteSheetData }

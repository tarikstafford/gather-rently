import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

// Gather Architecture Features: 1536x2496, 32x32 tiles, 48 columns, 78 rows = 3744 tiles
const width = 1536
const height = 2496
const url = '/sprites/spritesheets/gather_architecture_features.png'

// Generate tiles programmatically for the grid
const sprites: SpriteSheetTile[] = []
const columns = 48
const rows = 78
const tileSize = 32

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const index = row * columns + col
        sprites.push({
            name: `arch_${index}`,
            x: col * tileSize,
            y: row * tileSize,
            width: tileSize,
            height: tileSize,
            layer: 'object'
        })
    }
}

const gatherArchitectureSpriteSheetData = new SpriteSheetData(width, height, url, sprites)

export { gatherArchitectureSpriteSheetData }

import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

// Gather Signage 1.2: Signs and labels
const width = 512
const height = 512
const url = '/sprites/spritesheets/gather_signage_1.2.png'

// Generate tiles programmatically for the grid
const sprites: SpriteSheetTile[] = []
const columns = 16
const rows = 16
const tileSize = 32

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const index = row * columns + col
        sprites.push({
            name: `sign_${index}`,
            x: col * tileSize,
            y: row * tileSize,
            width: tileSize,
            height: tileSize,
            layer: 'object'
        })
    }
}

const gatherSignageSpriteSheetData = new SpriteSheetData(width, height, url, sprites)

export { gatherSignageSpriteSheetData }

import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

// Graffiti: Decorative graffiti sprites
const width = 512
const height = 512
const url = '/sprites/spritesheets/Grafitti1.png'

// Generate tiles programmatically for the grid
const sprites: SpriteSheetTile[] = []
const columns = 16
const rows = 16
const tileSize = 32

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const index = row * columns + col
        sprites.push({
            name: `graffiti_${index}`,
            x: col * tileSize,
            y: row * tileSize,
            width: tileSize,
            height: tileSize,
            layer: 'above_floor'
        })
    }
}

const gatherGraffitiSpriteSheetData = new SpriteSheetData(width, height, url, sprites)

export { gatherGraffitiSpriteSheetData }

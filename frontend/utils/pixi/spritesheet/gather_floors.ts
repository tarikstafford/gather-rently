import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

// Gather Floors 4.x: 1280x3008, 32x32 tiles, 40 columns, 94 rows = 3760 tiles
const width = 1280
const height = 3008
const url = '/sprites/spritesheets/gather_floors_4.1.png'

// Generate tiles programmatically for the grid
const sprites: SpriteSheetTile[] = []
const columns = 40
const rows = 94
const tileSize = 32

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const index = row * columns + col
        sprites.push({
            name: `floor_${index}`,
            x: col * tileSize,
            y: row * tileSize,
            width: tileSize,
            height: tileSize,
            layer: 'floor'
        })
    }
}

const gatherFloorsSpriteSheetData = new SpriteSheetData(width, height, url, sprites)

export { gatherFloorsSpriteSheetData }

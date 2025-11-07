import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

// Gather Terrains 4.x: 2560x3136, 32x32 tiles, 80 columns, 98 rows = 7840 tiles
const width = 2560
const height = 3136
const url = '/sprites/spritesheets/gather_terrains_4.0.png'

// Generate tiles programmatically for the grid
const sprites: SpriteSheetTile[] = []
const columns = 80
const rows = 98
const tileSize = 32

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const index = row * columns + col
        sprites.push({
            name: `terrain_${index}`,
            x: col * tileSize,
            y: row * tileSize,
            width: tileSize,
            height: tileSize,
            layer: 'floor'
        })
    }
}

const gatherTerrainsSpriteSheetData = new SpriteSheetData(width, height, url, sprites)

export { gatherTerrainsSpriteSheetData }

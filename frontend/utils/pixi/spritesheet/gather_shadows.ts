import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

// Gather Shadows 2.0: Small spritesheet for shadow effects
const width = 256
const height = 256
const url = '/sprites/spritesheets/gather_shadows_2.0.png'

// Generate tiles programmatically for the grid
const sprites: SpriteSheetTile[] = []
const columns = 8
const rows = 8
const tileSize = 32

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
        const index = row * columns + col
        sprites.push({
            name: `shadow_${index}`,
            x: col * tileSize,
            y: row * tileSize,
            width: tileSize,
            height: tileSize,
            layer: 'above_floor'
        })
    }
}

const gatherShadowsSpriteSheetData = new SpriteSheetData(width, height, url, sprites)

export { gatherShadowsSpriteSheetData }

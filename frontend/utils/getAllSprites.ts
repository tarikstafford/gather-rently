import { groundSpriteSheetData } from './pixi/spritesheet/ground'
import { citySpriteSheetData } from './pixi/spritesheet/city'
import { grasslandsSpriteSheetData } from './pixi/spritesheet/grasslands'
import { villageSpriteSheetData } from './pixi/spritesheet/village'
import { rentlySpriteSheetData } from './pixi/spritesheet/rently'
import { SheetName } from './pixi/spritesheet/spritesheet'

export interface SpriteInfo {
  name: string
  palette: SheetName
  layer: 'floor' | 'above_floor' | 'object'
  width: number
  height: number
  hasCollision: boolean
}

export function getAllSprites(): SpriteInfo[] {
  const allSprites: SpriteInfo[] = []

  const datasets = {
    ground: groundSpriteSheetData,
    city: citySpriteSheetData,
    grasslands: grasslandsSpriteSheetData,
    village: villageSpriteSheetData,
    rently: rentlySpriteSheetData,
  }

  for (const [palette, data] of Object.entries(datasets)) {
    for (const sprite of data.spritesList) {
      if (sprite.name === 'empty') continue

      allSprites.push({
        name: sprite.name,
        palette: palette as SheetName,
        layer: sprite.layer || 'floor',
        width: sprite.width,
        height: sprite.height,
        hasCollision: sprite.colliders ? sprite.colliders.length > 0 : false,
      })
    }
  }

  return allSprites
}

export function getFloorTiles(): SpriteInfo[] {
  return getAllSprites().filter(s => s.layer === 'floor')
}

export function getObjectTiles(): SpriteInfo[] {
  return getAllSprites().filter(s => s.layer === 'object')
}

export function getSpritesByPalette(palette: SheetName): SpriteInfo[] {
  return getAllSprites().filter(s => s.palette === palette)
}

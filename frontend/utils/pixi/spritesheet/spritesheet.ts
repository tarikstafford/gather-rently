import * as PIXI from 'pixi.js'
import { citySpriteSheetData } from './city'
import { groundSpriteSheetData } from './ground'
import { grasslandsSpriteSheetData } from './grasslands'
import { villageSpriteSheetData } from './village'
import { rentlySpriteSheetData } from './rently'
import { kenney_citySpriteSheetData } from './kenney_city'
import { kenney_buildingsSpriteSheetData } from './kenney_buildings'
import { kenney_landscapeSpriteSheetData } from './kenney_landscape'
import { gatherArchitectureSpriteSheetData } from './gather_architecture'
import { gatherFloorsSpriteSheetData } from './gather_floors'
import { gatherRoofsSpriteSheetData } from './gather_roofs'
import { gatherShadowsSpriteSheetData } from './gather_shadows'
import { gatherSignageSpriteSheetData } from './gather_signage'
import { gatherTerrainsSpriteSheetData } from './gather_terrains'
import { gatherWallsSpriteSheetData } from './gather_walls'
import { gatherGraffitiSpriteSheetData } from './gather_graffiti'
import { Layer } from '../types'
import { SpriteSheetData } from './SpriteSheetData'

export type Collider = {
    x: number,
    y: number,
}

export interface SpriteSheetTile {
    name: string,
    x: number
    y: number
    width: number
    height: number
    layer?: Layer
    colliders?: Collider[]
}

type Sheets = {
    [key in SheetName]?: PIXI.Spritesheet
}

export type SheetName = 'ground' | 'grasslands' | 'village' | 'city' | 'rently' | 'kenney_city' | 'kenney_buildings' | 'kenney_landscape' | 'gather_architecture' | 'gather_floors' | 'gather_roofs' | 'gather_shadows' | 'gather_signage' | 'gather_terrains' | 'gather_walls' | 'gather_graffiti'

class Sprites {
    public spriteSheetDataSet: { [key in SheetName]: SpriteSheetData } = {
        ground: groundSpriteSheetData,
        city: citySpriteSheetData,
        grasslands: grasslandsSpriteSheetData,
        village: villageSpriteSheetData,
        rently: rentlySpriteSheetData,
        kenney_city: kenney_citySpriteSheetData,
        kenney_buildings: kenney_buildingsSpriteSheetData,
        kenney_landscape: kenney_landscapeSpriteSheetData,
        gather_architecture: gatherArchitectureSpriteSheetData,
        gather_floors: gatherFloorsSpriteSheetData,
        gather_roofs: gatherRoofsSpriteSheetData,
        gather_shadows: gatherShadowsSpriteSheetData,
        gather_signage: gatherSignageSpriteSheetData,
        gather_terrains: gatherTerrainsSpriteSheetData,
        gather_walls: gatherWallsSpriteSheetData,
        gather_graffiti: gatherGraffitiSpriteSheetData,
    }
    public sheets: Sheets = {}

    public async load(sheetName: SheetName) {
        if (!this.spriteSheetDataSet[sheetName]) {
            throw new Error(`Sheet ${sheetName} not found`)
        }

        if (this.sheets[sheetName]) {
            return
        }

        await PIXI.Assets.load(this.spriteSheetDataSet[sheetName].url)
        this.sheets[sheetName] = new PIXI.Spritesheet(PIXI.Texture.from(this.spriteSheetDataSet[sheetName].url), this.getSpriteSheetData(this.spriteSheetDataSet[sheetName]))
        await this.sheets[sheetName]!.parse()
    }

    public async getSpriteForTileJSON(tilename: string) {
        const [sheetName, spriteName] = tilename.split('-')
        await this.load(sheetName as SheetName)
        return {
            sprite: this.getSprite(sheetName as SheetName, spriteName),
            data: this.getSpriteData(sheetName as SheetName, spriteName),
        }
    }

    public getSprite(sheetName: SheetName, spriteName: string) {
        if (!this.sheets[sheetName]) {
            throw new Error(`Sheet ${sheetName} not found`)
        }

        if (!this.sheets[sheetName]!.textures[spriteName]) {
            throw new Error(`Sprite ${spriteName} not found in sheet ${sheetName}`)
        }

        const sprite = new PIXI.Sprite(this.sheets[sheetName]!.textures[spriteName])
        return sprite
    }

    public getSpriteLayer(sheetName: SheetName, spriteName: string) {
        if (!this.spriteSheetDataSet[sheetName]) {
            throw new Error(`Sheet ${sheetName} not found`)
        }

        if (!this.spriteSheetDataSet[sheetName].sprites[spriteName]) {
            throw new Error(`Sprite ${spriteName} not found in sheet ${sheetName}`)
        }

        return this.spriteSheetDataSet[sheetName].sprites[spriteName].layer || 'floor'
    }

    public getSpriteData(sheetName: SheetName, spriteName: string) {
        if (!this.spriteSheetDataSet[sheetName]) {
            throw new Error(`Sheet ${sheetName} not found`)
        }

        if (!this.spriteSheetDataSet[sheetName].sprites[spriteName]) {
            throw new Error(`Sprite ${spriteName} not found in sheet ${sheetName}`)
        }

        return this.spriteSheetDataSet[sheetName].sprites[spriteName]
    }

    private getSpriteSheetData(data: SpriteSheetData) {
        const spriteSheetData = {
            frames: {} as any,
            meta: {
                image: data.url,
                size: {
                    w: data.width,
                    h: data.height
                },
                format: 'RGBA8888',
                scale: 1
            },
            animations: {}
        }

        for (const spriteData of data.spritesList) {
            if (spriteData.name === 'empty') {
                continue
            }

            spriteSheetData.frames[spriteData.name] = {
                frame: {
                    x: spriteData.x,
                    y: spriteData.y,
                    w: spriteData.width,
                    h: spriteData.height,
                },
                spriteSourceSize: {
                    x: 0,
                    y: 0,
                    w: spriteData.width,
                    h: spriteData.height,
                },
                sourceSize: {
                    w: spriteData.width,
                    h: spriteData.height,
                },
                anchor: {
                    x: 0,
                    y: 1 - (32 / spriteData.height),
                }
            }
        }

        return spriteSheetData
    }   
}

const sprites = new Sprites()

export { sprites }
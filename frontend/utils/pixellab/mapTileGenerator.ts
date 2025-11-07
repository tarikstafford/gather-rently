import { getPixelLabClient } from './client'
import { RealmData } from '../pixi/types'

export interface TileStyle {
    floor: string
    object?: string
}

export interface AIMapGenerationOptions {
    prompt: string
    width?: number
    height?: number
    generateCustomTiles?: boolean
}

/**
 * Generate custom tile sprites using PixelLab AI
 * Returns URLs to generated sprites that can be loaded as textures
 */
export async function generateCustomTiles(descriptions: {
    floor: string[]
    objects: string[]
}): Promise<{
    floorTiles: Record<string, string>
    objectTiles: Record<string, string>
}> {
    const client = getPixelLabClient()
    const floorTiles: Record<string, string> = {}
    const objectTiles: Record<string, string> = {}

    // Generate floor tiles
    for (const description of descriptions.floor) {
        try {
            const result = await client.generateImage({
                prompt: `pixel art tile, ${description}, top-down view, seamless tileable texture, game asset`,
                width: 132,
                height: 83,
                transparent: false
            })
            floorTiles[description] = result.image_url
        } catch (error) {
            console.error(`Failed to generate floor tile for "${description}":`, error)
        }
    }

    // Generate object tiles
    for (const description of descriptions.objects) {
        try {
            const result = await client.generateImage({
                prompt: `pixel art sprite, ${description}, top-down view, isometric, game asset, transparent background`,
                width: 132,
                height: 83,
                transparent: true
            })
            objectTiles[description] = result.image_url
        } catch (error) {
            console.error(`Failed to generate object tile for "${description}":`, error)
        }
    }

    return { floorTiles, objectTiles }
}

/**
 * Generate a complete map using AI-generated tiles
 * This creates both the map layout and custom sprites
 */
export async function generateMapWithAITiles(options: AIMapGenerationOptions): Promise<RealmData> {
    const width = options.width || 30
    const height = options.height || 30

    // First, we need to analyze the prompt to determine what tiles we need
    const tileDescriptions = analyzeProm ptForTiles(options.prompt)

    let customTiles: { floorTiles: Record<string, string>, objectTiles: Record<string, string> } | null = null

    if (options.generateCustomTiles) {
        // Generate custom sprites using PixelLab
        customTiles = await generateCustomTiles(tileDescriptions)
    }

    // Generate the map layout
    const tilemap: any = {}

    const addTile = (x: number, y: number, floor?: string, object?: string) => {
        const key = `${x}, ${y}`
        tilemap[key] = {}
        if (floor) tilemap[key].floor = floor
        if (object) tilemap[key].object = object
    }

    // For now, create a simple base map
    // TODO: Use AI to actually plan the layout based on the prompt
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            addTile(x, y, 'ai-grass-0')
        }
    }

    return {
        spawnpoint: {
            roomIndex: 0,
            x: Math.floor(width / 2),
            y: Math.floor(height / 2)
        },
        rooms: [
            {
                name: 'AI Generated Room',
                tilemap,
                customSprites: customTiles ? {
                    floors: customTiles.floorTiles,
                    objects: customTiles.objectTiles
                } : undefined
            }
        ]
    }
}

/**
 * Analyze a user prompt to determine what tiles need to be generated
 * This uses pattern matching and keywords to identify elements
 */
function analyzePromptForTiles(prompt: string): {
    floor: string[]
    objects: string[]
} {
    const lower = prompt.toLowerCase()

    const floorTypes: string[] = []
    const objectTypes: string[] = []

    // Floor types
    if (lower.includes('grass') || lower.includes('lawn') || lower.includes('garden')) {
        floorTypes.push('grass')
    }
    if (lower.includes('dirt') || lower.includes('path') || lower.includes('trail')) {
        floorTypes.push('dirt path')
    }
    if (lower.includes('stone') || lower.includes('cobblestone') || lower.includes('pavement')) {
        floorTypes.push('stone floor')
    }
    if (lower.includes('wood') || lower.includes('wooden floor') || lower.includes('hardwood')) {
        floorTypes.push('wooden floor')
    }
    if (lower.includes('carpet')) {
        floorTypes.push('carpet')
    }
    if (lower.includes('tile') || lower.includes('tiled floor')) {
        floorTypes.push('tiled floor')
    }
    if (lower.includes('water') || lower.includes('pond') || lower.includes('lake')) {
        floorTypes.push('water')
    }
    if (lower.includes('sand') || lower.includes('beach')) {
        floorTypes.push('sand')
    }

    // Objects
    if (lower.includes('tree') || lower.includes('forest')) {
        objectTypes.push('tree')
    }
    if (lower.includes('desk')) {
        objectTypes.push('office desk')
    }
    if (lower.includes('chair') || lower.includes('seating')) {
        objectTypes.push('office chair')
    }
    if (lower.includes('table')) {
        objectTypes.push('table')
    }
    if (lower.includes('plant') || lower.includes('flower')) {
        objectTypes.push('potted plant')
    }
    if (lower.includes('couch') || lower.includes('sofa')) {
        objectTypes.push('couch')
    }
    if (lower.includes('bookshelf') || lower.includes('books')) {
        objectTypes.push('bookshelf')
    }
    if (lower.includes('computer') || lower.includes('monitor')) {
        objectTypes.push('computer monitor')
    }
    if (lower.includes('whiteboard')) {
        objectTypes.push('whiteboard')
    }
    if (lower.includes('door')) {
        objectTypes.push('door')
    }
    if (lower.includes('window')) {
        objectTypes.push('window')
    }
    if (lower.includes('rock') || lower.includes('stone')) {
        objectTypes.push('rock')
    }
    if (lower.includes('fountain')) {
        objectTypes.push('fountain')
    }
    if (lower.includes('bench')) {
        objectTypes.push('bench')
    }

    // Default to basic tiles if nothing detected
    if (floorTypes.length === 0) {
        floorTypes.push('grass', 'wooden floor')
    }
    if (objectTypes.length === 0) {
        objectTypes.push('tree', 'rock')
    }

    return { floor: floorTypes, objects: objectTypes }
}

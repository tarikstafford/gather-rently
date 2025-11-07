import { RealmData } from './pixi/types'
import { generateMapWithAI } from './aiMapBuilder'
import { getPixelLabClient } from './pixellab/client'
import { SheetName } from './pixi/spritesheet/spritesheet'

export interface AIMapWithPixelLabOptions {
    prompt: string
    width?: number
    height?: number
    usePixelLabSprites?: boolean // Whether to generate custom sprites with PixelLab
    floorPalette?: SheetName
    objectPalettes?: SheetName[]
}

interface TileRequirement {
    type: 'floor' | 'object'
    description: string
    prompt: string
}

/**
 * Enhanced AI map builder that can generate custom sprites using PixelLab AI
 * Falls back to existing Kenney sprites if PixelLab is not available or disabled
 */
export async function generateMapWithPixelLab(options: AIMapWithPixelLabOptions): Promise<RealmData> {
    const {
        prompt,
        width = 50,
        height = 50,
        usePixelLabSprites = false,
        floorPalette = 'ground',
        objectPalettes = ['kenney_city', 'kenney_buildings', 'village']
    } = options

    // If PixelLab is disabled, use the standard AI map builder
    if (!usePixelLabSprites) {
        return generateMapWithAI({
            prompt,
            width,
            height,
            floorPalette,
            objectPalettes
        })
    }

    try {
        console.log('🎨 Starting PixelLab AI map generation...')

        // Step 1: Analyze the prompt to determine what custom sprites we need
        console.log('Step 1: Analyzing prompt for tile requirements...')
        const tileRequirements = await analyzePromptForCustomTiles(prompt)
        console.log(`Found ${tileRequirements.length} tile requirements:`, tileRequirements)

        // Step 2: Generate custom sprites using PixelLab
        console.log('Step 2: Generating custom sprites with PixelLab...')
        const customSprites = await generateCustomSprites(tileRequirements)
        console.log('Custom sprites generated:', {
            floors: Object.keys(customSprites.floors).length,
            objects: Object.keys(customSprites.objects).length
        })

        // Step 3: Generate the map layout using AI with references to custom sprites
        console.log('Step 3: Generating map layout with custom sprites...')
        const mapData = await generateMapLayoutWithCustomSprites(
            prompt,
            width,
            height,
            customSprites,
            tileRequirements
        )
        console.log('✅ PixelLab map generation complete!')

        return mapData

    } catch (error) {
        console.error('❌ PixelLab map generation failed, falling back to standard generation:', error)
        console.error('Error details:', error)
        // Fallback to standard generation if PixelLab fails
        return generateMapWithAI({
            prompt,
            width,
            height,
            floorPalette,
            objectPalettes
        })
    }
}

/**
 * Analyze the user's prompt using OpenAI to determine what custom tiles need to be generated
 */
async function analyzePromptForCustomTiles(prompt: string): Promise<TileRequirement[]> {
    const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    const OPENAI_API_BASE = 'https://api.openai.com/v1'

    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key required for sprite analysis')
    }

    const analysisPrompt = `Analyze this virtual space description and list all the unique tile types and objects needed:

"${prompt}"

For each unique element, provide:
1. Type: "floor" or "object"
2. Description: A 1-2 word name (e.g., "grass", "office desk", "meeting table")
3. Prompt: A detailed pixel art generation prompt

Respond with JSON only:
{
  "tiles": [
    {
      "type": "floor",
      "description": "grass",
      "prompt": "pixel art grass tile, top-down view, seamless tileable texture, vibrant green, game asset"
    },
    {
      "type": "object",
      "description": "office desk",
      "prompt": "pixel art office desk sprite, modern minimalist design, top-down isometric view, wooden surface, transparent background, game asset"
    }
  ]
}

Keep the list concise - only include distinct tile types that will be used multiple times.`

    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'user', content: analysisPrompt }
            ],
            temperature: 0.3,
            max_tokens: 1500,
            response_format: { type: 'json_object' }
        }),
    })

    if (!response.ok) {
        throw new Error(`Failed to analyze prompt: ${response.statusText}`)
    }

    const data = await response.json()
    const result = JSON.parse(data.choices[0].message.content)

    return result.tiles || []
}

/**
 * Generate custom sprites using PixelLab AI
 */
async function generateCustomSprites(requirements: TileRequirement[]): Promise<{
    floors: Record<string, string>
    objects: Record<string, string>
}> {
    const client = getPixelLabClient()
    const floors: Record<string, string> = {}
    const objects: Record<string, string> = {}

    for (const req of requirements) {
        try {
            console.log(`Generating ${req.type}: ${req.description}...`)

            const result = await client.generateImage({
                prompt: req.prompt,
                width: 132,
                height: 83,
                transparent: req.type === 'object',
                num_inference_steps: 20,
                guidance_scale: 7.5
            })

            if (req.type === 'floor') {
                floors[req.description] = result.image_url
            } else {
                objects[req.description] = result.image_url
            }

            console.log(`✓ Generated ${req.description}: ${result.image_url}`)

        } catch (error) {
            console.error(`Failed to generate ${req.description}:`, error)
            // Continue with other sprites even if one fails
        }
    }

    return { floors, objects }
}

/**
 * Generate the map layout using OpenAI, with custom sprite references
 */
async function generateMapLayoutWithCustomSprites(
    prompt: string,
    width: number,
    height: number,
    customSprites: { floors: Record<string, string>, objects: Record<string, string> },
    tileRequirements: TileRequirement[]
): Promise<RealmData> {
    const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    const OPENAI_API_BASE = 'https://api.openai.com/v1'

    if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key required for map generation')
    }

    const floorList = Object.keys(customSprites.floors)
    const objectList = Object.keys(customSprites.objects)

    const systemPrompt = `You are a virtual space layout designer. Create a ${width}x${height} tile map.

Available Custom Floor Tiles:
${floorList.map(f => `- ${f}`).join('\n') || '- (none)'}

Available Custom Objects:
${objectList.map(o => `- ${o}`).join('\n') || '- (none)'}

Design Principles:
1. Create clear functional zones
2. Leave 2-3 tile pathways between areas
3. Place objects in realistic arrangements
4. Don't overcrowd spaces
5. Ensure spawn point is accessible

Output JSON format:
{
  "rooms": [
    {
      "name": "Room Name",
      "x": number,
      "y": number,
      "width": number,
      "height": number,
      "floorTile": "valid_floor_name",
      "objects": [
        {"name": "valid_object_name", "x": number, "y": number}
      ]
    }
  ],
  "spawnX": number,
  "spawnY": number
}`

    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            temperature: 0.4,
            max_tokens: 3000,
            response_format: { type: 'json_object' }
        }),
    })

    if (!response.ok) {
        throw new Error(`Failed to generate layout: ${response.statusText}`)
    }

    const data = await response.json()
    const layout = JSON.parse(data.choices[0].message.content)

    // Convert to RealmData format with custom sprites
    return convertLayoutToRealmDataWithCustomSprites(layout, customSprites)
}

/**
 * Convert AI-generated layout to RealmData format with custom sprite URLs
 */
function convertLayoutToRealmDataWithCustomSprites(
    layout: any,
    customSprites: { floors: Record<string, string>, objects: Record<string, string> }
): RealmData {
    const tilemap: Record<string, any> = {}

    // Process each room
    for (const room of layout.rooms || []) {
        const floorTile = room.floorTile || Object.keys(customSprites.floors)[0] || 'grass'

        // Create floor tiles
        for (let x = room.x; x < room.x + room.width; x++) {
            for (let y = room.y; y < room.y + room.height; y++) {
                const key = `${x}, ${y}`
                tilemap[key] = {
                    floor: `pixellab-${floorTile}` // Use special prefix for custom sprites
                }

                // Add walls at perimeter
                if (
                    x === room.x ||
                    x === room.x + room.width - 1 ||
                    y === room.y ||
                    y === room.y + room.height - 1
                ) {
                    tilemap[key].impassable = true
                }
            }
        }

        // Place objects
        for (const obj of room.objects || []) {
            const key = `${obj.x}, ${obj.y}`
            if (tilemap[key]) {
                tilemap[key].object = `pixellab-${obj.name}`
                tilemap[key].impassable = true
            }
        }
    }

    return {
        spawnpoint: {
            roomIndex: 0,
            x: layout.spawnX || Math.floor(layout.rooms[0].width / 2),
            y: layout.spawnY || Math.floor(layout.rooms[0].height / 2),
        },
        rooms: [
            {
                name: 'Main Floor',
                tilemap,
                customSprites // Include custom sprite URLs
            },
        ],
    }
}

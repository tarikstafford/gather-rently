import { RealmData } from './pixi/types'
import { getAllSprites, getFloorTiles, getObjectTiles, SpriteInfo } from './getAllSprites'
import { SheetName } from './pixi/spritesheet/spritesheet'

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
const OPENAI_API_BASE = 'https://api.openai.com/v1'

// Cache of available sprites for validation
let spriteCache: Map<string, boolean> | null = null

function initializeSpriteCache() {
  if (spriteCache) return spriteCache

  spriteCache = new Map()
  const allSprites = getAllSprites()

  for (const sprite of allSprites) {
    const key = `${sprite.palette}-${sprite.name}`
    spriteCache.set(key, true)
  }

  return spriteCache
}

function isSpriteAvailable(palette: string, spriteName: string): boolean {
  const cache = initializeSpriteCache()
  return cache.has(`${palette}-${spriteName}`)
}

function findClosestAvailableSprite(palette: SheetName, desiredName: string): string | null {
  const sprites = getAllSprites().filter(s => s.palette === palette)

  // Try exact match first
  const exact = sprites.find(s => s.name === desiredName)
  if (exact) return exact.name

  // Try partial match (contains the desired name)
  const partial = sprites.find(s => s.name.includes(desiredName) || desiredName.includes(s.name))
  if (partial) return partial.name

  // Return a default object sprite if available
  const objectSprites = sprites.filter(s => s.layer === 'object')
  if (objectSprites.length > 0) {
    return objectSprites[0].name
  }

  return null
}

interface AIMapRequest {
  prompt: string
  width?: number
  height?: number
  palette?: SheetName
}

interface RoomLayout {
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
  floorTile: string
  objects: Array<{
    name: string
    x: number
    y: number
  }>
}

export async function generateMapWithAI(request: AIMapRequest): Promise<RealmData> {
  const { prompt, width = 50, height = 50, palette = 'rently' } = request

  // Get available sprites
  const allSprites = getAllSprites()
  const floorTiles = getFloorTiles().filter(s => !palette || s.palette === palette)
  const objectTiles = getObjectTiles().filter(s => !palette || s.palette === palette)

  // Get available sprites for validation
  const availableObjects = getObjectTiles().filter(s => s.palette === 'village')

  // Create a structured prompt for the AI
  const systemPrompt = `You are a virtual space designer. Generate a JSON map layout based on the user's description.

Available floor tiles (${palette} palette):
${floorTiles.slice(0, 20).map(t => `- ${t.name}`).join('\n')}

Available objects/furniture (village palette - ONLY USE THESE):
${availableObjects.slice(0, 30).map(t => `- ${t.name} (${t.width}x${t.height})`).join('\n')}

IMPORTANT: You must ONLY use sprites from the lists above. Do not make up sprite names!

You must respond with valid JSON only. Use this exact format:
{
  "rooms": [
    {
      "name": "Office 1",
      "type": "office",
      "x": 5,
      "y": 5,
      "width": 10,
      "height": 10,
      "floorTile": "white_plum_floor",
      "objects": [
        { "name": "modern_desk", "x": 7, "y": 7 },
        { "name": "ergonomic_chair", "x": 8, "y": 8 }
      ]
    }
  ],
  "spawnX": 10,
  "spawnY": 10
}

Rules:
- Room coordinates must be within 0-${width} x 0-${height}
- Use only the floor tiles and objects listed above
- Rooms should not overlap
- Objects should be placed inside their rooms
- Include hallways to connect rooms
- Spawn point should be in a safe, accessible location`

  try {
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using fallback generation')
      return generateFallbackMap(prompt, width, height, palette)
    }

    // Call OpenAI Chat API
    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API error:', errorData)
      throw new Error(`AI API request failed: ${response.statusText}`)
    }

    const data = await response.json()

    // Parse the AI response
    const aiResponse = data.choices[0].message.content

    // Extract JSON from response (in case there's extra text)
    let layoutData
    try {
      // Try to find JSON in the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        layoutData = JSON.parse(jsonMatch[0])
      } else {
        layoutData = JSON.parse(aiResponse)
      }
    } catch (e) {
      console.error('Failed to parse AI response:', aiResponse)
      // Fallback to a simple generated map
      return generateFallbackMap(prompt, width, height, palette)
    }

    // Convert AI layout to RealmData format
    return convertAILayoutToRealmData(layoutData, palette)

  } catch (error) {
    console.error('AI map generation error:', error)
    // Fallback to procedural generation
    return generateFallbackMap(prompt, width, height, palette)
  }
}

function convertAILayoutToRealmData(layout: any, palette: SheetName): RealmData {
  const tilemap: Record<string, any> = {}

  // Process each room
  for (const room of layout.rooms || []) {
    // Validate floor tile
    const requestedFloor = room.floorTile || 'light_solid_grass'
    let floorTile = requestedFloor

    if (!isSpriteAvailable(palette, requestedFloor)) {
      console.warn(`Floor tile '${requestedFloor}' not found in ${palette} palette, trying to find alternative...`)
      const alternative = findClosestAvailableSprite(palette, requestedFloor)
      if (alternative) {
        floorTile = alternative
        console.log(`Using '${alternative}' instead of '${requestedFloor}'`)
      } else {
        // Fallback to a known floor tile
        floorTile = 'light_solid_grass'
        console.log(`Using fallback floor tile: ${floorTile}`)
      }
    }

    // Create floor tiles
    for (let x = room.x; x < room.x + room.width; x++) {
      for (let y = room.y; y < room.y + room.height; y++) {
        const key = `${x}, ${y}`
        tilemap[key] = { floor: `${palette}-${floorTile}` }

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

    // Place objects (use village palette for objects)
    for (const obj of room.objects || []) {
      // Validate object sprite
      if (!isSpriteAvailable('village', obj.name)) {
        console.warn(`Object '${obj.name}' not found in village palette, trying to find alternative...`)
        const alternative = findClosestAvailableSprite('village', obj.name)
        if (alternative) {
          console.log(`Using '${alternative}' instead of '${obj.name}'`)
          obj.name = alternative
        } else {
          console.warn(`No alternative found for '${obj.name}', skipping object placement`)
          continue // Skip this object
        }
      }

      const key = `${obj.x}, ${obj.y}`
      if (tilemap[key]) {
        tilemap[key].object = `village-${obj.name}`
        tilemap[key].impassable = true
      }
    }
  }

  return {
    spawnpoint: {
      roomIndex: 0,
      x: layout.spawnX || 10,
      y: layout.spawnY || 10,
    },
    rooms: [
      {
        name: 'Main Floor',
        tilemap,
      },
    ],
  }
}

function generateFallbackMap(prompt: string, width: number, height: number, palette: SheetName): RealmData {
  // Simple fallback: create a basic room
  const tilemap: Record<string, any> = {}
  const roomWidth = Math.min(20, width - 10)
  const roomHeight = Math.min(20, height - 10)
  const startX = 5
  const startY = 5

  for (let x = startX; x < startX + roomWidth; x++) {
    for (let y = startY; y < startY + roomHeight; y++) {
      const key = `${x}, ${y}`
      tilemap[key] = { floor: `${palette}-light_solid_grass` }

      if (
        x === startX ||
        x === startX + roomWidth - 1 ||
        y === startY ||
        y === startY + roomHeight - 1
      ) {
        tilemap[key].impassable = true
      }
    }
  }

  return {
    spawnpoint: {
      roomIndex: 0,
      x: startX + Math.floor(roomWidth / 2),
      y: startY + Math.floor(roomHeight / 2),
    },
    rooms: [
      {
        name: 'Main Floor',
        tilemap,
      },
    ],
  }
}

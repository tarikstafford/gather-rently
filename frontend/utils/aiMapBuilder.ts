import { RealmData } from './pixi/types'
import { getAllSprites, getFloorTiles, getObjectTiles, SpriteInfo } from './getAllSprites'
import { SheetName } from './pixi/spritesheet/spritesheet'

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
const OPENAI_API_BASE = 'https://api.openai.com/v1'

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

  // Create a structured prompt for the AI
  const systemPrompt = `You are a virtual space designer. Generate a JSON map layout based on the user's description.

Available floor tiles (${palette} palette):
${floorTiles.slice(0, 20).map(t => `- ${t.name}`).join('\n')}

Available objects/furniture (${palette} palette):
${objectTiles.slice(0, 30).map(t => `- ${t.name} (${t.width}x${t.height})`).join('\n')}

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
    // Create floor tiles
    for (let x = room.x; x < room.x + room.width; x++) {
      for (let y = room.y; y < room.y + room.height; y++) {
        const key = `${x}, ${y}`
        tilemap[key] = { floor: `${palette}-${room.floorTile || 'white_plum_floor'}` }

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

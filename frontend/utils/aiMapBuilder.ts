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
  floorPalette?: SheetName
  objectPalettes?: SheetName[]
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

interface LayoutPlan {
  description: string
  zones: Array<{
    name: string
    purpose: string
    estimatedSize: string
  }>
}

export async function generateMapWithAI(request: AIMapRequest): Promise<RealmData> {
  const {
    prompt,
    width = 50,
    height = 50,
    floorPalette = 'ground',
    objectPalettes = ['kenney_city', 'kenney_buildings', 'village']
  } = request

  // Get available sprites for floors
  const floorTiles = getFloorTiles().filter(s => s.palette === floorPalette)

  // Get available sprites for objects from all selected palettes
  const availableObjects = getObjectTiles().filter(s => objectPalettes.includes(s.palette as SheetName))

  // Group objects by palette for better organization in prompt
  const objectsByPalette: Record<string, typeof availableObjects> = {}
  for (const obj of availableObjects) {
    if (!objectsByPalette[obj.palette]) {
      objectsByPalette[obj.palette] = []
    }
    objectsByPalette[obj.palette].push(obj)
  }

  // Categorize sprites by function to provide better context
  const categorizeSprite = (name: string): string => {
    const lowerName = name.toLowerCase()

    // Furniture categories
    if (lowerName.includes('chair') || lowerName.includes('seat') || lowerName.includes('bench')) return 'seating'
    if (lowerName.includes('desk') || lowerName.includes('table') || lowerName.includes('counter')) return 'tables'
    if (lowerName.includes('bed') || lowerName.includes('couch') || lowerName.includes('sofa')) return 'comfort_furniture'
    if (lowerName.includes('shelf') || lowerName.includes('cabinet') || lowerName.includes('bookcase') || lowerName.includes('drawer')) return 'storage'

    // Decor and plants
    if (lowerName.includes('plant') || lowerName.includes('tree') || lowerName.includes('flower') || lowerName.includes('pot')) return 'plants'
    if (lowerName.includes('lamp') || lowerName.includes('light')) return 'lighting'
    if (lowerName.includes('picture') || lowerName.includes('art') || lowerName.includes('painting')) return 'wall_decor'

    // Tech and equipment
    if (lowerName.includes('computer') || lowerName.includes('monitor') || lowerName.includes('laptop')) return 'tech'
    if (lowerName.includes('whiteboard') || lowerName.includes('board')) return 'presentation'

    // Kitchen
    if (lowerName.includes('stove') || lowerName.includes('oven') || lowerName.includes('fridge') || lowerName.includes('sink')) return 'appliances'

    // Outdoor/structures
    if (lowerName.includes('fence') || lowerName.includes('wall') || lowerName.includes('door') || lowerName.includes('gate')) return 'structural'
    if (lowerName.includes('car') || lowerName.includes('vehicle') || lowerName.includes('bike')) return 'vehicles'

    // Misc
    if (lowerName.includes('box') || lowerName.includes('crate') || lowerName.includes('container')) return 'containers'

    return 'decorative'
  }

  const categorizedObjects: Record<string, SpriteInfo[]> = {}
  for (const obj of availableObjects) {
    const category = categorizeSprite(obj.name)
    if (!categorizedObjects[category]) {
      categorizedObjects[category] = []
    }
    categorizedObjects[category].push(obj)
  }

  // Create a structured prompt for the AI
  const systemPrompt = `You are an expert virtual space designer specializing in creating coherent, realistic, and functional 2D top-down virtual environments.

🎨 DESIGN PRINCIPLES:
1. **Spatial Coherence**: Create spaces that look realistic and organized, not random
2. **Functional Zoning**: Group related activities together (workstations, meeting areas, social spaces)
3. **Traffic Flow**: Leave clear pathways between areas (2-3 tiles wide)
4. **Object Context**: Place objects in realistic arrangements:
   - Chairs should be positioned at/near desks and tables
   - Kitchen appliances should be grouped together
   - Plants and decor should enhance spaces, not block them
   - Storage furniture along walls
5. **Visual Balance**: Don't overcrowd - leave breathing room
6. **Accessibility**: Ensure all areas are reachable from spawn point

📐 AVAILABLE RESOURCES:

Floor Tiles (${floorPalette} palette):
${floorTiles.map(t => `- ${t.name}`).join('\n')}

Objects by Function - ONLY USE THESE:
${Object.entries(categorizedObjects)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([category, objects]) =>
    `\n${category.toUpperCase().replace(/_/g, ' ')} (${objects.length} items):
${objects.map(o => `  • ${o.name} [${o.width}x${o.height}px]`).join('\n')}`
  ).join('\n')}

🏗️ LAYOUT EXAMPLES:

Example 1 - Small Office:
{
  "rooms": [
    {
      "name": "Main Office",
      "type": "workspace",
      "x": 5, "y": 5, "width": 15, "height": 12,
      "floorTile": "light_solid_grass",
      "objects": [
        {"name": "desk_1", "x": 7, "y": 7},
        {"name": "chair", "x": 7, "y": 8},
        {"name": "desk_2", "x": 12, "y": 7},
        {"name": "chair", "x": 12, "y": 8},
        {"name": "plant", "x": 6, "y": 6},
        {"name": "bookshelf", "x": 18, "y": 7}
      ]
    },
    {
      "name": "Meeting Room",
      "type": "meeting",
      "x": 5, "y": 20, "width": 10, "height": 8,
      "floorTile": "light_solid_grass",
      "objects": [
        {"name": "table", "x": 9, "y": 23},
        {"name": "chair", "x": 8, "y": 23},
        {"name": "chair", "x": 10, "y": 23},
        {"name": "chair", "x": 9, "y": 24},
        {"name": "whiteboard", "x": 9, "y": 21}
      ]
    }
  ],
  "spawnX": 12,
  "spawnY": 11
}

Example 2 - Kitchen Area:
{
  "rooms": [{
    "name": "Kitchen",
    "type": "kitchen",
    "x": 10, "y": 10, "width": 12, "height": 10,
    "floorTile": "light_solid_grass",
    "objects": [
      {"name": "counter", "x": 11, "y": 11},
      {"name": "counter", "x": 12, "y": 11},
      {"name": "stove", "x": 13, "y": 11},
      {"name": "fridge", "x": 14, "y": 11},
      {"name": "table", "x": 15, "y": 15},
      {"name": "chair", "x": 14, "y": 15},
      {"name": "chair", "x": 16, "y": 15}
    ]
  }],
  "spawnX": 16,
  "spawnY": 18
}

⚠️ CRITICAL RULES:
1. Map dimensions: 0-${width} (x-axis) by 0-${height} (y-axis)
2. ONLY use sprite names from the lists above - DO NOT invent names!
3. Use ONLY the sprite name in JSON (e.g., "box"), never include palette prefix
4. Rooms must NOT overlap with each other
5. Leave 2-3 tile gaps between rooms for hallways/pathways
6. Objects must be INSIDE their room boundaries
7. Place spawn point in an open, central, accessible area
8. Create logical groupings: desks with chairs, appliances together, meeting areas cohesive
9. Don't place objects right at room edges - leave 1 tile border inside walls

🎯 OUTPUT FORMAT (JSON only - no explanations):
{
  "rooms": [
    {
      "name": "Room Name",
      "type": "office|meeting|kitchen|lounge|etc",
      "x": number,
      "y": number,
      "width": number,
      "height": number,
      "floorTile": "valid_floor_name",
      "objects": [
        {"name": "valid_sprite_name", "x": number, "y": number}
      ]
    }
  ],
  "spawnX": number,
  "spawnY": number
}`

  try {
    if (!OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using fallback generation')
      return generateFallbackMap(prompt, width, height, floorPalette)
    }

    // PHASE 1: Generate a high-level layout plan
    const planningPrompt = `Given this space description: "${prompt}"

Create a strategic layout plan for a ${width}x${height} tile virtual space.

Consider:
- What functional zones are needed?
- How should they be arranged for good flow?
- Approximate sizes for each zone?
- How do zones connect?

Respond with JSON only:
{
  "description": "Brief overview of the layout strategy",
  "zones": [
    {"name": "Zone name", "purpose": "What happens here", "estimatedSize": "small/medium/large"}
  ]
}`

    const planResponse = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: planningPrompt }
        ],
        temperature: 0.5,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      }),
    })

    let layoutPlan: LayoutPlan | null = null
    if (planResponse.ok) {
      const planData = await planResponse.json()
      try {
        layoutPlan = JSON.parse(planData.choices[0].message.content)
        console.log('Layout plan:', layoutPlan)
      } catch (e) {
        console.warn('Failed to parse layout plan, proceeding without it')
      }
    }

    // PHASE 2: Generate detailed map with the plan in mind
    const detailedPrompt = layoutPlan
      ? `${prompt}\n\nLayout Strategy: ${layoutPlan.description}\n\nRequired Zones:\n${layoutPlan.zones.map(z => `- ${z.name}: ${z.purpose} (${z.estimatedSize})`).join('\n')}`
      : prompt

    // Call OpenAI Chat API for detailed generation
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
          { role: 'user', content: detailedPrompt }
        ],
        temperature: 0.4,
        max_tokens: 4000,
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
      return generateFallbackMap(prompt, width, height, floorPalette)
    }

    // Validate and optimize the layout
    const validatedLayout = validateAndOptimizeLayout(layoutData, width, height)

    // Convert AI layout to RealmData format
    return convertAILayoutToRealmData(validatedLayout, floorPalette, objectPalettes)

  } catch (error) {
    console.error('AI map generation error:', error)
    // Fallback to procedural generation
    return generateFallbackMap(prompt, width, height, floorPalette)
  }
}

function validateAndOptimizeLayout(layout: any, width: number, height: number): any {
  // Validate and fix room boundaries
  for (const room of layout.rooms || []) {
    // Ensure rooms are within bounds
    room.x = Math.max(0, Math.min(room.x, width - 10))
    room.y = Math.max(0, Math.min(room.y, height - 10))
    room.width = Math.max(5, Math.min(room.width, width - room.x))
    room.height = Math.max(5, Math.min(room.height, height - room.y))

    // Validate objects are inside room boundaries
    room.objects = (room.objects || []).filter((obj: any) => {
      const isInside =
        obj.x >= room.x + 1 &&
        obj.x < room.x + room.width - 1 &&
        obj.y >= room.y + 1 &&
        obj.y < room.y + room.height - 1

      if (!isInside) {
        console.warn(`Object ${obj.name} at (${obj.x}, ${obj.y}) is outside room ${room.name}, removing`)
      }
      return isInside
    })
  }

  // Validate spawn point
  if (!layout.spawnX || !layout.spawnY ||
      layout.spawnX < 0 || layout.spawnX >= width ||
      layout.spawnY < 0 || layout.spawnY >= height) {
    console.warn('Invalid spawn point, using center of map')
    layout.spawnX = Math.floor(width / 2)
    layout.spawnY = Math.floor(height / 2)
  }

  // Check for room overlaps and log warnings
  for (let i = 0; i < layout.rooms.length; i++) {
    for (let j = i + 1; j < layout.rooms.length; j++) {
      const r1 = layout.rooms[i]
      const r2 = layout.rooms[j]

      const overlap = !(
        r1.x + r1.width <= r2.x ||
        r2.x + r2.width <= r1.x ||
        r1.y + r1.height <= r2.y ||
        r2.y + r2.height <= r1.y
      )

      if (overlap) {
        console.warn(`Rooms ${r1.name} and ${r2.name} overlap - layout may look crowded`)
      }
    }
  }

  return layout
}

function convertAILayoutToRealmData(layout: any, floorPalette: SheetName, objectPalettes: SheetName[]): RealmData {
  const tilemap: Record<string, any> = {}

  // Process each room
  for (const room of layout.rooms || []) {
    // Validate floor tile
    const requestedFloor = room.floorTile || 'light_solid_grass'
    let floorTile = requestedFloor

    if (!isSpriteAvailable(floorPalette, requestedFloor)) {
      console.warn(`Floor tile '${requestedFloor}' not found in ${floorPalette} palette, trying to find alternative...`)
      const alternative = findClosestAvailableSprite(floorPalette, requestedFloor)
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
        tilemap[key] = { floor: `${floorPalette}-${floorTile}` }

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

    // Place objects - check across all allowed palettes
    for (const obj of room.objects || []) {
      // Find which palette contains this sprite
      let foundPalette: SheetName | null = null
      for (const palette of objectPalettes) {
        if (isSpriteAvailable(palette, obj.name)) {
          foundPalette = palette
          break
        }
      }

      if (!foundPalette) {
        console.warn(`Object '${obj.name}' not found in any palette, trying to find alternative...`)
        // Try to find alternative in any of the allowed palettes
        for (const palette of objectPalettes) {
          const alternative = findClosestAvailableSprite(palette, obj.name)
          if (alternative) {
            console.log(`Using '${alternative}' from ${palette} instead of '${obj.name}'`)
            obj.name = alternative
            foundPalette = palette
            break
          }
        }

        if (!foundPalette) {
          console.warn(`No alternative found for '${obj.name}', skipping object placement`)
          continue // Skip this object
        }
      }

      const key = `${obj.x}, ${obj.y}`
      if (tilemap[key]) {
        tilemap[key].object = `${foundPalette}-${obj.name}`
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

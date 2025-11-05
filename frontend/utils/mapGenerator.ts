import { RealmData } from './pixi/types'

/**
 * Random Map Generator
 * Generates procedural maps with rooms, hallways, and decorations
 */

type RoomType = 'office' | 'meeting' | 'lounge' | 'meditation' | 'music' | 'kitchen'

interface GeneratorConfig {
  width: number
  height: number
  numRooms: number
  roomMinSize: number
  roomMaxSize: number
  palette?: 'ground' | 'grasslands' | 'village' | 'city' | 'rently'
}

interface Rectangle {
  x: number
  y: number
  width: number
  height: number
  type?: RoomType
}

const DEFAULT_CONFIG: GeneratorConfig = {
  width: 50,
  height: 50,
  numRooms: 6,
  roomMinSize: 5,
  roomMaxSize: 12,
  palette: 'rently'
}

// Floor tiles by palette
const FLOOR_TILES: Record<string, string[]> = {
  ground: ['light_solid_grass', 'detailed_grass', 'normal_solid_grass'],
  grasslands: ['grass', 'grass_flowers', 'grass_detail'],
  village: ['wood_floor', 'stone_floor', 'brick_floor'],
  city: ['concrete', 'tile_floor', 'marble'],
  rently: ['white_plum_floor', 'plum_carpet', 'plum_carpet']
}

// Objects/furniture by room type
const ROOM_OBJECTS: Record<RoomType, string[]> = {
  office: ['modern_desk', 'ergonomic_chair', 'large_plant', 'whiteboard'],
  meeting: ['meeting_table_4', 'ergonomic_chair', 'whiteboard'],
  lounge: ['modern_sofa', 'large_plant', 'coffee_machine'],
  meditation: ['meditation_cushion', 'yoga_mat', 'large_plant'],
  music: ['acoustic_guitar', 'keyboard_synth'],
  kitchen: ['coffee_machine', 'refrigerator']
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rectanglesOverlap(r1: Rectangle, r2: Rectangle, padding: number = 2): boolean {
  return !(
    r1.x + r1.width + padding < r2.x ||
    r2.x + r2.width + padding < r1.x ||
    r1.y + r1.height + padding < r2.y ||
    r2.y + r2.height + padding < r1.y
  )
}

function generateRooms(config: GeneratorConfig): Rectangle[] {
  const rooms: Rectangle[] = []
  const roomTypes: RoomType[] = ['office', 'meeting', 'lounge', 'meditation', 'music', 'kitchen']

  let attempts = 0
  const maxAttempts = config.numRooms * 20

  while (rooms.length < config.numRooms && attempts < maxAttempts) {
    attempts++

    const width = randomInt(config.roomMinSize, config.roomMaxSize)
    const height = randomInt(config.roomMinSize, config.roomMaxSize)
    const x = randomInt(1, config.width - width - 1)
    const y = randomInt(1, config.height - height - 1)

    const newRoom: Rectangle = { x, y, width, height, type: randomChoice(roomTypes) }

    let overlaps = false
    for (const room of rooms) {
      if (rectanglesOverlap(newRoom, room)) {
        overlaps = true
        break
      }
    }

    if (!overlaps) {
      rooms.push(newRoom)
    }
  }

  return rooms
}

function getRoomCenter(room: Rectangle): { x: number, y: number } {
  return {
    x: Math.floor(room.x + room.width / 2),
    y: Math.floor(room.y + room.height / 2)
  }
}

function createHallway(
  start: { x: number, y: number },
  end: { x: number, y: number },
  tilemap: Record<string, any>,
  floorTile: string,
  palette: string
) {
  // L-shaped hallway
  const midX = start.x
  const midY = end.y

  // Horizontal segment
  const minX = Math.min(start.x, end.x)
  const maxX = Math.max(start.x, end.x)
  for (let x = minX; x <= maxX; x++) {
    const key = `${x}, ${midY}`
    if (!tilemap[key]) {
      tilemap[key] = { floor: `${palette}:${floorTile}` }
    }
  }

  // Vertical segment
  const minY = Math.min(start.y, midY)
  const maxY = Math.max(start.y, midY)
  for (let y = minY; y <= maxY; y++) {
    const key = `${midX}, ${y}`
    if (!tilemap[key]) {
      tilemap[key] = { floor: `${palette}:${floorTile}` }
    }
  }
}

function placeRoomObjects(
  room: Rectangle,
  tilemap: Record<string, any>,
  palette: string
) {
  if (!room.type || !ROOM_OBJECTS[room.type]) return

  const objects = ROOM_OBJECTS[room.type]
  const numObjects = randomInt(2, 4)

  for (let i = 0; i < numObjects; i++) {
    const obj = randomChoice(objects)
    const x = randomInt(room.x + 1, room.x + room.width - 2)
    const y = randomInt(room.y + 1, room.y + room.height - 2)
    const key = `${x}, ${y}`

    if (tilemap[key] && !tilemap[key].object) {
      tilemap[key].object = `${palette}:${obj}`
      tilemap[key].impassable = true
    }
  }
}

export function generateRandomMap(userConfig?: Partial<GeneratorConfig>): RealmData {
  const config = { ...DEFAULT_CONFIG, ...userConfig }
  const palette = config.palette || 'rently'
  const floorTiles = FLOOR_TILES[palette] || FLOOR_TILES.rently
  const floorTile = randomChoice(floorTiles)

  const rooms = generateRooms(config)
  const tilemap: Record<string, any> = {}

  // Create room floors
  for (const room of rooms) {
    for (let x = room.x; x < room.x + room.width; x++) {
      for (let y = room.y; y < room.y + room.height; y++) {
        const key = `${x}, ${y}`
        tilemap[key] = { floor: `${palette}:${floorTile}` }

        // Add walls (make perimeter impassable)
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
  }

  // Connect rooms with hallways
  for (let i = 0; i < rooms.length - 1; i++) {
    const start = getRoomCenter(rooms[i])
    const end = getRoomCenter(rooms[i + 1])
    createHallway(start, end, tilemap, floorTile, palette)
  }

  // Place objects in rooms
  for (const room of rooms) {
    placeRoomObjects(room, tilemap, palette)
  }

  // Set spawn point in first room center
  const spawnRoom = rooms[0]
  const spawnCenter = getRoomCenter(spawnRoom)

  return {
    spawnpoint: {
      roomIndex: 0,
      x: spawnCenter.x,
      y: spawnCenter.y
    },
    rooms: [
      {
        name: 'Main Floor',
        tilemap
      }
    ]
  }
}

export function generateRentlyOffice(): RealmData {
  return generateRandomMap({
    width: 60,
    height: 60,
    numRooms: 8,
    roomMinSize: 6,
    roomMaxSize: 14,
    palette: 'rently'
  })
}

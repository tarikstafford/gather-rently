import { RealmData } from './pixi/types'

/**
 * Generates a magical forest map using only Kenney sprite sets
 * Features: winding paths, clearings, dense forest areas, magical elements
 */
export function generateMagicalForest(): RealmData {
    const width = 40
    const height = 40
    const tilemap: any = {}

    // Helper to add a tile
    const addTile = (x: number, y: number, floor?: string, object?: string) => {
        const key = `${x}, ${y}`
        tilemap[key] = {}
        if (floor) tilemap[key].floor = floor
        if (object) tilemap[key].object = object
    }

    // Generate base grass floor
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            // Use varied grass tiles for natural look
            const grassVariant = Math.random() < 0.7 ? 'kenney_landscape-0' :
                                 Math.random() < 0.5 ? 'kenney_landscape-1' : 'kenney_landscape-2'
            addTile(x, y, grassVariant)
        }
    }

    // Create winding dirt path through the forest
    const pathPoints: {x: number, y: number}[] = []
    let pathX = 5
    let pathY = height / 2

    while (pathX < width - 5) {
        pathPoints.push({x: pathX, y: Math.floor(pathY)})
        pathX += 1
        pathY += (Math.random() - 0.5) * 2
        pathY = Math.max(5, Math.min(height - 5, pathY))
    }

    // Draw the path
    pathPoints.forEach(point => {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const x = point.x + dx
                const y = point.y + dy
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    addTile(x, y, 'kenney_landscape-10') // dirt path
                }
            }
        }
    })

    // Create several forest clearings
    const clearings = [
        {x: 10, y: 10, radius: 4},
        {x: 30, y: 15, radius: 5},
        {x: 20, y: 30, radius: 4},
        {x: 35, y: 35, radius: 3}
    ]

    clearings.forEach(clearing => {
        for (let x = clearing.x - clearing.radius; x <= clearing.x + clearing.radius; x++) {
            for (let y = clearing.y - clearing.radius; y <= clearing.y + clearing.radius; y++) {
                const dist = Math.sqrt((x - clearing.x) ** 2 + (y - clearing.y) ** 2)
                if (dist <= clearing.radius && x >= 0 && x < width && y >= 0 && y < height) {
                    addTile(x, y, 'kenney_landscape-0') // clear grass
                }
            }
        }
    })

    // Plant trees throughout the forest (avoiding paths and clearings)
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const key = `${x}, ${y}`
            const tile = tilemap[key]

            // Don't place trees on dirt paths or in clearing centers
            if (tile.floor === 'kenney_landscape-10') continue

            const inClearing = clearings.some(c => {
                const dist = Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2)
                return dist < c.radius - 1
            })

            if (inClearing) continue

            // Random tree placement - denser forest
            if (Math.random() < 0.4) {
                // Various tree types from kenney_landscape
                const treeTypes = [
                    'kenney_landscape-40', 'kenney_landscape-41', 'kenney_landscape-42',
                    'kenney_landscape-43', 'kenney_landscape-44', 'kenney_landscape-45',
                    'kenney_landscape-50', 'kenney_landscape-51'
                ]
                const tree = treeTypes[Math.floor(Math.random() * treeTypes.length)]
                tilemap[key].object = tree

                // Make trees impassable
                tilemap[key].impassable = true
            }
        }
    }

    // Add magical elements in clearings
    clearings.forEach((clearing, index) => {
        // Add flowers/mushrooms around clearing edges
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 6) {
            const x = Math.round(clearing.x + Math.cos(angle) * (clearing.radius - 1))
            const y = Math.round(clearing.y + Math.sin(angle) * (clearing.radius - 1))
            const key = `${x}, ${y}`

            if (tilemap[key] && !tilemap[key].object) {
                // Flowers, mushrooms, plants
                const decorations = [
                    'kenney_landscape-30', 'kenney_landscape-31', 'kenney_landscape-32',
                    'kenney_landscape-33', 'kenney_landscape-34', 'kenney_landscape-35'
                ]
                tilemap[key].object = decorations[Math.floor(Math.random() * decorations.length)]
            }
        }

        // Center feature in each clearing
        const centerKey = `${clearing.x}, ${clearing.y}`
        if (index === 0) {
            // Fountain or statue
            tilemap[centerKey].object = 'kenney_city-100'
        } else if (index === 1) {
            // Campfire area
            tilemap[centerKey].object = 'kenney_landscape-60'
        } else if (index === 2) {
            // Stone circle
            tilemap[centerKey].object = 'kenney_landscape-70'
        }
    })

    // Add rocks and stumps scattered throughout
    for (let i = 0; i < 30; i++) {
        const x = Math.floor(Math.random() * width)
        const y = Math.floor(Math.random() * height)
        const key = `${x}, ${y}`

        if (tilemap[key] && !tilemap[key].object && tilemap[key].floor !== 'kenney_landscape-10') {
            const features = ['kenney_landscape-80', 'kenney_landscape-81', 'kenney_landscape-82']
            tilemap[key].object = features[Math.floor(Math.random() * features.length)]
            tilemap[key].impassable = true
        }
    }

    // Set spawn point in the main clearing
    const spawnpoint = {
        roomIndex: 0,
        x: 10,
        y: 10
    }

    return {
        spawnpoint,
        rooms: [
            {
                name: 'Magical Forest',
                tilemap
            }
        ]
    }
}

import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

const width = 1024
const height = 1024
const url = '/sprites/spritesheets/rently.png'

const sprites: SpriteSheetTile[] = [
    // Floor tiles (plum-themed)
    { name: 'white_plum_floor', x: 0, y: 0, width: 32, height: 32 },
    { name: 'light_plum_floor', x: 32, y: 0, width: 32, height: 32 },
    { name: 'plum_carpet', x: 64, y: 0, width: 32, height: 32 },
    { name: 'dark_plum_floor', x: 96, y: 0, width: 32, height: 32 },

    // Modern desks (individual workstations)
    { name: 'modern_desk', x: 0, y: 32, width: 64, height: 64, layer: 'object', colliders: [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }
    ]},
    { name: 'standing_desk', x: 64, y: 32, width: 64, height: 64, layer: 'object', colliders: [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }
    ]},

    // Office chairs
    { name: 'ergonomic_chair', x: 128, y: 32, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},
    { name: 'executive_chair', x: 160, y: 32, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},

    // Meeting room furniture
    { name: 'meeting_table_4', x: 0, y: 96, width: 128, height: 96, layer: 'object', colliders: [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
        { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
        { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }
    ]},
    { name: 'conference_table', x: 128, y: 96, width: 160, height: 128, layer: 'object', colliders: [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
        { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
        { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
        { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }
    ]},

    // Meditation room items
    { name: 'meditation_cushion', x: 0, y: 224, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},
    { name: 'yoga_mat', x: 32, y: 224, width: 32, height: 64, layer: 'object' },
    { name: 'zen_fountain', x: 64, y: 224, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},
    { name: 'incense_holder', x: 96, y: 224, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},

    // Music room items
    { name: 'acoustic_guitar', x: 128, y: 224, width: 32, height: 64, layer: 'object', colliders: [{ x: 0, y: 1 }]},
    { name: 'keyboard_synth', x: 160, y: 224, width: 64, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }, { x: 1, y: 0 }]},
    { name: 'drum_kit', x: 224, y: 224, width: 64, height: 64, layer: 'object', colliders: [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }
    ]},

    // Plants (biophilic design)
    { name: 'large_plant', x: 0, y: 288, width: 32, height: 64, layer: 'object', colliders: [{ x: 0, y: 1 }]},
    { name: 'desk_plant', x: 32, y: 288, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},
    { name: 'hanging_plant', x: 64, y: 288, width: 32, height: 32, layer: 'above_floor' },

    // Lounge furniture
    { name: 'modern_sofa', x: 96, y: 288, width: 96, height: 64, layer: 'object', colliders: [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
        { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }
    ]},
    { name: 'bean_bag', x: 192, y: 288, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},
    { name: 'coffee_table', x: 224, y: 288, width: 64, height: 64, layer: 'object', colliders: [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }
    ]},

    // Kitchen items
    { name: 'coffee_machine', x: 0, y: 352, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},
    { name: 'refrigerator', x: 32, y: 352, width: 32, height: 64, layer: 'object', colliders: [{ x: 0, y: 0 }, { x: 0, y: 1 }]},
    { name: 'kitchen_counter', x: 64, y: 352, width: 64, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }, { x: 1, y: 0 }]},
    { name: 'bar_stool', x: 128, y: 352, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},

    // Phone booths
    { name: 'phone_booth', x: 160, y: 352, width: 64, height: 64, layer: 'object', colliders: [
        { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }
    ]},

    // Walls (plum-themed)
    { name: 'plum_wall_h', x: 0, y: 416, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},
    { name: 'plum_wall_v', x: 32, y: 416, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},
    { name: 'glass_wall', x: 64, y: 416, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},

    // Decorations
    { name: 'rently_logo_wall', x: 96, y: 416, width: 64, height: 32, layer: 'above_floor' },
    { name: 'whiteboard', x: 160, y: 416, width: 64, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }, { x: 1, y: 0 }]},
    { name: 'monitor', x: 224, y: 416, width: 32, height: 32, layer: 'object', colliders: [{ x: 0, y: 0 }]},
    { name: 'bookshelf', x: 256, y: 416, width: 32, height: 64, layer: 'object', colliders: [{ x: 0, y: 0 }, { x: 0, y: 1 }]},
]

const rentlySpriteSheetData = new SpriteSheetData(width, height, url, sprites)

export { rentlySpriteSheetData }

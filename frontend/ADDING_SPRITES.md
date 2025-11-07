# Adding New Sprites to Rently Digital Office

This guide explains how to add new sprites (tiles, furniture, objects) to the Rently virtual office.

## Overview

Sprites are organized into **palettes** (also called spritesheets). Each palette is:
- A single PNG image containing multiple sprites
- A TypeScript definition file that maps sprite names to their positions in the image

Current palettes:
- `ground` - Grass, dirt, sand tiles
- `grasslands` - Natural outdoor tiles
- `village` - Medieval/rustic furniture and buildings
- `city` - Modern urban tiles and objects
- `rently` - Custom Rently-branded office furniture (not yet generated)

## Method 1: Add to Existing Spritesheet (Manual)

### Step 1: Edit the Spritesheet Image

1. Open the existing spritesheet PNG file (e.g., `/public/sprites/spritesheets/village.png`)
2. Use an image editor (Photoshop, GIMP, Aseprite, etc.)
3. Add your new sprite to an empty area of the image
4. Note the **x, y coordinates** and **width, height** of your sprite

**Important:**
- Use pixel-perfect positioning (no anti-aliasing on edges)
- Maintain consistent pixel art style
- Standard tile size is 32x32 pixels, but objects can be larger

### Step 2: Update the TypeScript Definition

Open the corresponding file (e.g., `utils/pixi/spritesheet/village.ts`):

```typescript
const sprites: SpriteSheetTile[] = [
    // ... existing sprites ...

    // Add your new sprite
    {
        name: 'my_new_desk',           // Unique identifier
        x: 512,                         // X position in spritesheet
        y: 256,                         // Y position in spritesheet
        width: 64,                      // Width in pixels
        height: 64,                     // Height in pixels
        layer: 'object',                // 'floor', 'above_floor', or 'object'
        colliders: [                    // Optional: collision points
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
        ]
    },
]
```

### Step 3: Use the Sprite

In the map editor, your sprite will now appear in the palette menu. You can also reference it in code:

```typescript
// In tilemap JSON
{
  "10, 15": {
    "object": "village-my_new_desk"  // palette-spritename
  }
}
```

## Method 2: Create New Spritesheet

### Step 1: Create Sprite Definitions

Create a new file: `utils/pixi/spritesheet/mypalette.ts`

```typescript
import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

const width = 1024   // Spritesheet width
const height = 1024  // Spritesheet height
const url = '/sprites/spritesheets/mypalette.png'

const sprites: SpriteSheetTile[] = [
    {
        name: 'floor_tile',
        x: 0,
        y: 0,
        width: 32,
        height: 32
    },
    {
        name: 'desk',
        x: 0,
        y: 32,
        width: 64,
        height: 64,
        layer: 'object',
        colliders: [{ x: 0, y: 1 }, { x: 1, y: 1 }]
    },
    // ... more sprites ...
]

const mypaletteSpriteSheetData = new SpriteSheetData(
    width,
    height,
    url,
    sprites
)

export { mypaletteSpriteSheetData }
```

### Step 2: Create the Spritesheet Image

1. Create a new PNG file at `/public/sprites/spritesheets/mypalette.png`
2. Size should match the width/height in your definition (e.g., 1024x1024)
3. Add all your sprites at the coordinates you specified

**Tools:**
- **Aseprite** (recommended for pixel art)
- **Piskel** (free online pixel art editor)
- **TexturePacker** (for packing multiple images into a spritesheet)

### Step 3: Register the Palette

Update `utils/pixi/spritesheet/spritesheet.ts`:

```typescript
import { mypaletteSpriteSheetData } from './mypalette'

// Add to SheetName type
export type SheetName = 'ground' | 'grasslands' | 'village' | 'city' | 'rently' | 'mypalette'

// Add to spriteSheetDataSet
public spriteSheetDataSet: { [key in SheetName]: SpriteSheetData } = {
    ground: groundSpriteSheetData,
    city: citySpriteSheetData,
    grasslands: grasslandsSpriteSheetData,
    village: villageSpriteSheetData,
    rently: rentlySpriteSheetData,
    mypalette: mypaletteSpriteSheetData,  // Add this line
}
```

### Step 4: Enable in Map Editor

Update `app/editor/Editor.tsx`:

```typescript
const palettes: SheetName[] = ['ground', 'grasslands', 'village', 'city', 'rently', 'mypalette']
```

## Method 3: AI-Generated Sprites (Rently Example)

We have a script to generate sprites using AI, though it needs additional work to composite them:

### Step 1: Define Sprites

Already done in `utils/pixi/spritesheet/rently.ts`

### Step 2: Generate Individual Sprites

```bash
# Make sure you have the Kie.ai API key set
node scripts/generateRentlySprites.js
```

This creates individual PNG files in `/temp/sprites/`

### Step 3: Composite into Spritesheet

You'll need to manually arrange these into a spritesheet, or create a script:

```bash
npm install canvas
node scripts/composeSprites.js  # (needs to be created)
```

Or use a tool like TexturePacker to combine the individual images.

### Step 4: Place the Spritesheet

Move the final spritesheet to:
```
/public/sprites/spritesheets/rently.png
```

## Sprite Guidelines

### Layers
- **floor**: Ground tiles, walkable surfaces
- **above_floor**: Decorative overlays on ground (grass edges, shadows)
- **object**: Furniture, walls, items (usually has collisions)

### Colliders
Colliders define which tiles block player movement:
```typescript
colliders: [
    { x: 0, y: 0 },  // Top-left tile is solid
    { x: 1, y: 0 },  // Top-right tile is solid
    { x: 0, y: 1 },  // Bottom-left tile is solid
    { x: 1, y: 1 }   // Bottom-right tile is solid
]
```

For a 64x64 sprite (2x2 tiles), you typically want all 4 tiles solid.
For a 32x32 sprite (1x1 tile), use `[{ x: 0, y: 0 }]`

### Naming Conventions
- Use snake_case: `modern_desk`, `office_chair`
- Be descriptive: `white_plum_floor`, `ergonomic_chair`
- Include orientation if needed: `chair_down`, `chair_up`

### Size Standards
- **Tiles**: 32x32 pixels
- **Small objects**: 32x32 (chairs, plants)
- **Medium objects**: 64x64 (desks, tables)
- **Large objects**: 96x96 or larger (conference tables)

## Testing Your Sprites

1. **In Editor**: Create a new space with blank map
2. **Select Palette**: Choose your palette from the dropdown
3. **Place Sprite**: Click the sprite, then click on the map
4. **Test Collision**: Enter play mode, try walking through the object
5. **Test Visuals**: Check that it renders correctly at different zoom levels

## Troubleshooting

### "Sheet not found" Error
- Check that the palette is registered in `spritesheet.ts`
- Verify the SheetName type includes your palette

### "Sprite not found" Error
- Check the sprite name matches exactly (case-sensitive)
- Verify coordinates in the TypeScript file match the PNG

### Sprite Appears Blurry
- Make sure the image is using nearest-neighbor scaling
- Check that pixel coordinates are whole numbers (no decimals)

### Collision Not Working
- Verify `colliders` array is set correctly
- Check that layer is set to `'object'`
- Ensure `impassable: true` is set in tilemap JSON

## Example: Adding a Coffee Machine

1. **Create the sprite image** (32x32 or 64x64 pixels)
2. **Add to village.png** at position (576, 256)
3. **Update village.ts**:
   ```typescript
   {
       name: 'coffee_machine',
       x: 576,
       y: 256,
       width: 32,
       height: 64,
       layer: 'object',
       colliders: [{ x: 0, y: 1 }]  // Only bottom tile blocks
   }
   ```
4. **Use in map**: `"5, 10": { "object": "village-coffee_machine" }`

## Resources

- **Pixel Art Tools**: Aseprite, Piskel, GraphicsGale
- **Spritesheet Packers**: TexturePacker, ShoeBox, Leshy SpriteSheet Tool
- **Color Palettes**: Lospec (https://lospec.com/palette-list)
- **Inspiration**: OpenGameArt.org, itch.io asset packs

## Need Help?

Check existing sprite definitions in `utils/pixi/spritesheet/` for examples!

# Adding Kenney.nl Isometric Sprites

Kenney.nl provides free high-quality 2D isometric sprite packs that can be added to the game.

## Finding Kenney Sprites

Visit: https://kenney.nl/assets

**Recommended Packs for Office/Indoor:**
- **Isometric Office** - Desks, chairs, computers, office furniture
- **Isometric Furniture** - General furniture for interiors
- **Isometric City** - Buildings and urban elements
- **Isometric Tiles** - Floor and wall tiles

## Method 1: Individual Sprites (Quick Start)

### Step 1: Download Asset Pack

1. Go to https://kenney.nl/assets
2. Find an isometric pack (e.g., "Isometric Office")
3. Download the pack (usually comes as a ZIP)
4. Extract the ZIP file

### Step 2: Select Sprites

Kenney packs typically include:
- Individual PNG files for each sprite
- Already separated and ready to use
- Consistent sizing and style

### Step 3: Create Spritesheet from Individual Images

You have two options:

#### Option A: Manual Composition

1. Create a new 1024x1024 (or larger) blank PNG
2. Arrange individual Kenney sprites on it
3. Note the x, y coordinates of each sprite
4. Save as `/public/sprites/spritesheets/kenney.png`

#### Option B: Use TexturePacker (Recommended)

TexturePacker is free for basic use and automates this:

1. Download TexturePacker: https://www.codeandweb.com/texturepacker
2. Drag all Kenney PNG files into TexturePacker
3. Settings:
   - Framework: PixiJS
   - Data Format: JSON (Hash)
   - Algorithm: Basic
   - Trim: None (keep original sizes)
4. Export to get:
   - `kenney.png` (the spritesheet)
   - `kenney.json` (the coordinates)

### Step 4: Create TypeScript Definition

Create `/utils/pixi/spritesheet/kenney.ts`:

```typescript
import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

const width = 1024   // Your spritesheet width
const height = 1024  // Your spritesheet height
const url = '/sprites/spritesheets/kenney.png'

const sprites: SpriteSheetTile[] = [
    // Office furniture
    {
        name: 'desk_computer',
        x: 0,
        y: 0,
        width: 64,    // Kenney sprites are often 64x64 or 128x128
        height: 64,
        layer: 'object',
        colliders: [{ x: 0, y: 1 }, { x: 1, y: 1 }]  // Bottom row blocks
    },
    {
        name: 'office_chair',
        x: 64,
        y: 0,
        width: 64,
        height: 64,
        layer: 'object',
        colliders: [{ x: 0, y: 0 }]  // Single tile blocks
    },
    {
        name: 'filing_cabinet',
        x: 128,
        y: 0,
        width: 64,
        height: 64,
        layer: 'object',
        colliders: [{ x: 0, y: 0 }]
    },
    {
        name: 'meeting_table',
        x: 0,
        y: 64,
        width: 128,   // Larger furniture
        height: 128,
        layer: 'object',
        colliders: [
            { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
            { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }
        ]
    },
    // Floor tiles
    {
        name: 'tile_floor',
        x: 192,
        y: 0,
        width: 64,
        height: 32,  // Isometric floor tiles are often wider than tall
    },
    {
        name: 'wood_floor',
        x: 192,
        y: 32,
        width: 64,
        height: 32,
    },
    // Add more sprites...
]

const kenneySpriteSheetData = new SpriteSheetData(
    width,
    height,
    url,
    sprites
)

export { kenneySpriteSheetData }
```

### Step 5: Register the Palette

Update `utils/pixi/spritesheet/spritesheet.ts`:

```typescript
import { kenneySpriteSheetData } from './kenney'

export type SheetName = 'ground' | 'grasslands' | 'village' | 'city' | 'rently' | 'kenney'

public spriteSheetDataSet: { [key in SheetName]: SpriteSheetData } = {
    ground: groundSpriteSheetData,
    city: citySpriteSheetData,
    grasslands: grasslandsSpriteSheetData,
    village: villageSpriteSheetData,
    rently: rentlySpriteSheetData,
    kenney: kenneySpriteSheetData,
}
```

### Step 6: Enable in Editor

Update `app/editor/Editor.tsx`:

```typescript
const palettes: SheetName[] = ['ground', 'grasslands', 'village', 'city', 'rently', 'kenney']
```

## Method 2: Automated Script

Create a script to automatically generate the TypeScript definitions from Kenney's folder structure:

### Create `scripts/importKenneySprites.js`:

```javascript
const fs = require('fs');
const path = require('path');

const KENNEY_FOLDER = './kenney_isometric_office'; // Your extracted folder
const OUTPUT_FILE = './utils/pixi/spritesheet/kenney.ts';

// Scan all PNG files
const sprites = [];
let currentX = 0;
let currentY = 0;
const maxWidth = 1024;
const rowHeight = 128; // Adjust based on your sprite sizes

fs.readdirSync(KENNEY_FOLDER).forEach(file => {
    if (file.endsWith('.png')) {
        const name = file.replace('.png', '');

        // Determine sprite type and properties
        const isFloor = name.includes('floor') || name.includes('tile');
        const layer = isFloor ? 'floor' : 'object';
        const width = 64;  // Adjust based on actual Kenney sprite size
        const height = isFloor ? 32 : 64;

        sprites.push({
            name,
            x: currentX,
            y: currentY,
            width,
            height,
            layer,
            file: path.join(KENNEY_FOLDER, file)
        });

        // Update position for next sprite
        currentX += width;
        if (currentX + width > maxWidth) {
            currentX = 0;
            currentY += rowHeight;
        }
    }
});

// Generate TypeScript file
const tsContent = `import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

const width = ${maxWidth}
const height = ${currentY + rowHeight}
const url = '/sprites/spritesheets/kenney.png'

const sprites: SpriteSheetTile[] = [
${sprites.map(s => `    {
        name: '${s.name}',
        x: ${s.x},
        y: ${s.y},
        width: ${s.width},
        height: ${s.height},
        layer: '${s.layer}'${s.layer === 'object' ? ',\n        colliders: [{ x: 0, y: 0 }]' : ''}
    }`).join(',\n')}
]

const kenneySpriteSheetData = new SpriteSheetData(width, height, url, sprites)

export { kenneySpriteSheetData }
`;

fs.writeFileSync(OUTPUT_FILE, tsContent);
console.log(`✅ Generated ${OUTPUT_FILE} with ${sprites.length} sprites`);
console.log(`📐 Spritesheet size: ${maxWidth}x${currentY + rowHeight}`);
console.log(`\n⚠️  Next steps:`);
console.log(`1. Use an image compositor to create the actual spritesheet PNG`);
console.log(`2. Place it at /public/sprites/spritesheets/kenney.png`);
console.log(`\nSprite positions:`);
sprites.forEach(s => {
    console.log(`  ${s.name}: (${s.x}, ${s.y}) from ${s.file}`);
});
```

Run it:
```bash
node scripts/importKenneySprites.js
```

## Method 3: Using Kenney's Spritesheets (If Available)

Some Kenney packs come with pre-made spritesheets:

1. Use the provided spritesheet PNG
2. Use the provided XML/JSON file to extract coordinates
3. Convert to our TypeScript format

## Important: Isometric Considerations

### Sizing
- Kenney isometric sprites are typically **64x64** or **128x128** pixels
- Floor tiles are often **64x32** (wider than tall for isometric perspective)
- Adjust your game's tile size if needed

### Collision Detection
For isometric sprites, collision should typically be on the **base** of the object:

```typescript
// For a 64x64 desk sprite
colliders: [{ x: 0, y: 1 }]  // Only bottom tile blocks

// For a 128x128 conference table (4x4 tiles)
colliders: [
    { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }  // Bottom row only
]
```

### Layer Ordering
Isometric sprites should be on the `object` layer so they render above floor tiles:

```typescript
layer: 'object'  // Not 'floor' or 'above_floor'
```

## Recommended Kenney Packs for Office

1. **Isometric Office**: Desks, computers, chairs, filing cabinets
2. **Isometric Furniture**: Sofas, tables, beds, decorations
3. **Isometric Tiles**: Various floor and wall tiles
4. **Isometric City**: Buildings, vehicles (for outdoor areas)

All free at: https://kenney.nl/assets/category:Isometric

## Example: Complete Workflow

Let's add Kenney's Isometric Office pack:

### 1. Download
```
https://kenney.nl/assets/isometric-office
→ Download → Extract to /kenney_isometric_office/
```

### 2. Create Spritesheet
Use TexturePacker or manual composition to create:
```
/public/sprites/spritesheets/kenney_office.png
```

### 3. Define Sprites
```typescript
// /utils/pixi/spritesheet/kenney_office.ts
const sprites: SpriteSheetTile[] = [
    { name: 'desk_computer', x: 0, y: 0, width: 64, height: 64, layer: 'object' },
    { name: 'chair_office', x: 64, y: 0, width: 64, height: 64, layer: 'object' },
    { name: 'plant_small', x: 128, y: 0, width: 64, height: 64, layer: 'object' },
    // ... all sprites
]
```

### 4. Register & Use
- Add to `spritesheet.ts`
- Add to `Editor.tsx` palette list
- Use in map: `kenney_office-desk_computer`

## Tips

- **Consistent Scale**: Kenney sprites are pre-scaled, but verify they match your existing sprites
- **Naming**: Keep original Kenney names for easy reference
- **Attribution**: Kenney's assets are CC0 (public domain), but attribution is appreciated
- **Updates**: Kenney regularly updates packs, check for new sprites

## Tools You'll Need

1. **TexturePacker** - Free version works great: https://www.codeandweb.com/texturepacker
2. **Image Editor** - GIMP (free) or Photoshop for manual composition
3. **Node.js** - For automation scripts

## Already Using Kenney?

Check if any of your existing spritesheets are based on Kenney assets - they have a distinctive isometric style that's recognizable!

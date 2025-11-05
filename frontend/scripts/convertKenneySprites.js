const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

const KENNEY_DIR = path.join(__dirname, '../kenney_files');
const OUTPUT_DIR = path.join(__dirname, '../utils/pixi/spritesheet');
const PUBLIC_SPRITES_DIR = path.join(__dirname, '../public/sprites/spritesheets');

// Ensure output directories exist
if (!fs.existsSync(PUBLIC_SPRITES_DIR)) {
  fs.mkdirSync(PUBLIC_SPRITES_DIR, { recursive: true });
}

// Map of Kenney folders to our palette names
const KENNEY_FOLDERS = [
  { folder: 'kenney_isometric-city', paletteName: 'kenney_city' },
  { folder: 'kenney_isometric-buildings-1', paletteName: 'kenney_buildings' },
  { folder: 'kenney_isometric-landscape', paletteName: 'kenney_landscape' },
  { folder: 'kenney_isometric-miniature-library', paletteName: 'kenney_library' },
  { folder: 'kenney_isometric-miniature-dungeon', paletteName: 'kenney_dungeon' },
];

function cleanSpriteName(filename) {
  // Remove .png extension and convert to snake_case
  return filename.replace('.png', '').replace(/-/g, '_');
}

function determineLayer(name) {
  const lower = name.toLowerCase();

  // Floor tiles - anything with "tile", "floor", "ground"
  if (lower.includes('tile') || lower.includes('floor') || lower.includes('ground')) {
    return 'floor';
  }

  // Everything else is an object
  return 'object';
}

function generateColliders(width, height) {
  // Assume standard tile size of 32x32
  const tileWidth = 32;
  const tileHeight = 32;

  const tilesX = Math.ceil(width / tileWidth);
  const tilesY = Math.ceil(height / tileHeight);

  // For objects, add colliders on the bottom row only (isometric base)
  if (tilesX === 1 && tilesY === 1) {
    return [{ x: 0, y: 0 }];
  }

  // Bottom row colliders for multi-tile objects
  const colliders = [];
  for (let x = 0; x < tilesX; x++) {
    colliders.push({ x, y: tilesY - 1 });
  }

  return colliders;
}

async function processKenneyPack(folderName, paletteName) {
  const kenneyPath = path.join(KENNEY_DIR, folderName);
  const spritesheetDir = path.join(kenneyPath, 'Spritesheet');

  if (!fs.existsSync(spritesheetDir)) {
    console.warn(`⚠️  No Spritesheet directory found in ${folderName}`);
    return null;
  }

  // Find all XML files in spritesheet directory
  const xmlFiles = fs.readdirSync(spritesheetDir).filter(f => f.endsWith('.xml'));

  if (xmlFiles.length === 0) {
    console.warn(`⚠️  No XML files found in ${folderName}/Spritesheet`);
    return null;
  }

  console.log(`\n📦 Processing ${folderName}...`);
  console.log(`   Found ${xmlFiles.length} spritesheet(s)`);

  const allSprites = [];
  let maxWidth = 0;
  let maxHeight = 0;
  let primarySpritesheet = null;

  // Process each XML/PNG pair
  for (const xmlFile of xmlFiles) {
    const xmlPath = path.join(spritesheetDir, xmlFile);
    const pngFile = xmlFile.replace('.xml', '.png');
    const pngPath = path.join(spritesheetDir, pngFile);

    if (!fs.existsSync(pngPath)) {
      console.warn(`   ⚠️  PNG not found for ${xmlFile}`);
      continue;
    }

    // Parse XML
    const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
    const result = await parseStringPromise(xmlContent);

    if (!result.TextureAtlas || !result.TextureAtlas.SubTexture) {
      console.warn(`   ⚠️  Invalid XML structure in ${xmlFile}`);
      continue;
    }

    const subTextures = result.TextureAtlas.SubTexture;
    console.log(`   📄 ${xmlFile}: ${subTextures.length} sprites`);

    // Get image dimensions from first successful read
    if (!primarySpritesheet) {
      primarySpritesheet = pngFile;
    }

    // Process each sprite in the XML
    for (const subTexture of subTextures) {
      const attrs = subTexture.$;
      const name = cleanSpriteName(attrs.name);
      const x = parseInt(attrs.x);
      const y = parseInt(attrs.y);
      const width = parseInt(attrs.width);
      const height = parseInt(attrs.height);

      // Track max dimensions
      if (x + width > maxWidth) maxWidth = x + width;
      if (y + height > maxHeight) maxHeight = y + height;

      const layer = determineLayer(name);
      const sprite = {
        name,
        x,
        y,
        width,
        height,
        layer,
      };

      // Add colliders for objects
      if (layer === 'object') {
        sprite.colliders = generateColliders(width, height);
      }

      allSprites.push(sprite);
    }

    // Copy PNG to public directory with palette name
    const destPngPath = path.join(PUBLIC_SPRITES_DIR, `${paletteName}.png`);
    fs.copyFileSync(pngPath, destPngPath);
    console.log(`   ✅ Copied ${pngFile} → ${paletteName}.png`);
  }

  if (allSprites.length === 0) {
    console.warn(`   ⚠️  No sprites found in ${folderName}`);
    return null;
  }

  // Generate TypeScript file
  const tsContent = generateTypeScriptFile(paletteName, maxWidth, maxHeight, allSprites);
  const tsPath = path.join(OUTPUT_DIR, `${paletteName}.ts`);
  fs.writeFileSync(tsPath, tsContent);

  console.log(`   ✅ Generated ${paletteName}.ts with ${allSprites.length} sprites`);
  console.log(`   📐 Spritesheet size: ${maxWidth}x${maxHeight}`);

  return {
    paletteName,
    spriteCount: allSprites.length,
    width: maxWidth,
    height: maxHeight,
  };
}

function generateTypeScriptFile(paletteName, width, height, sprites) {
  const spritesCode = sprites.map(s => {
    const collidersCode = s.colliders
      ? `,\n        colliders: [${s.colliders.map(c => `{ x: ${c.x}, y: ${c.y} }`).join(', ')}]`
      : '';

    return `    {
        name: '${s.name}',
        x: ${s.x},
        y: ${s.y},
        width: ${s.width},
        height: ${s.height},
        layer: '${s.layer}'${collidersCode}
    }`;
  }).join(',\n');

  return `import { SpriteSheetTile } from './spritesheet'
import { SpriteSheetData } from './SpriteSheetData'

const width = ${width}
const height = ${height}
const url = '/sprites/spritesheets/${paletteName}.png'

const sprites: SpriteSheetTile[] = [
${spritesCode}
]

const ${paletteName}SpriteSheetData = new SpriteSheetData(
    width,
    height,
    url,
    sprites
)

export { ${paletteName}SpriteSheetData }
`;
}

async function main() {
  console.log('🎨 Converting Kenney Spritesheets...\n');

  const results = [];

  for (const { folder, paletteName } of KENNEY_FOLDERS) {
    const result = await processKenneyPack(folder, paletteName);
    if (result) {
      results.push(result);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ CONVERSION COMPLETE\n');
  console.log('Generated palettes:');
  results.forEach(r => {
    console.log(`  • ${r.paletteName}: ${r.spriteCount} sprites (${r.width}x${r.height})`);
  });

  console.log('\n📝 Next steps:');
  console.log('  1. Update utils/pixi/spritesheet/spritesheet.ts to import and register these palettes');
  console.log('  2. Update app/editor/Editor.tsx to add them to the palette selector');
  console.log('\nImport statements to add to spritesheet.ts:');
  results.forEach(r => {
    console.log(`import { ${r.paletteName}SpriteSheetData } from './${r.paletteName}'`);
  });

  console.log('\nAdd to SheetName type:');
  const paletteNames = results.map(r => `'${r.paletteName}'`).join(' | ');
  console.log(`export type SheetName = 'ground' | 'grasslands' | 'village' | 'city' | 'rently' | ${paletteNames}`);

  console.log('\nAdd to spriteSheetDataSet:');
  results.forEach(r => {
    console.log(`    ${r.paletteName}: ${r.paletteName}SpriteSheetData,`);
  });
}

main().catch(console.error);

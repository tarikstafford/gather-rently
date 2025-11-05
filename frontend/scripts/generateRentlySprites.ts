/**
 * Script to generate Rently office sprites using Kie.ai API
 * Run with: npx ts-node scripts/generateRentlySprites.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const KIE_API_KEY = '4dd79de23f593b3bbc90afcacd0e0cc6';
const KIE_API_BASE = 'https://api.kie.ai/api/v1/gpt4o-image';

// Rently brand colors
const BRAND_COLORS = {
  darkPlum: '#301064',
  plum: '#553081',
  plumStain: '#E1CFFF',
  whitePlum: '#FAF6FF',
  sweetMint: '#11BB8D',
  dolphinGray: '#7A86A9',
};

interface SpriteRequest {
  name: string;
  prompt: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const spriteRequests: SpriteRequest[] = [
  // Floor tiles
  {
    name: 'white_plum_floor',
    prompt: `32x32 pixel art floor tile, light color ${BRAND_COLORS.whitePlum}, modern office flooring, top-down view, seamless tileable`,
    x: 0,
    y: 0,
    width: 32,
    height: 32,
  },
  {
    name: 'plum_carpet',
    prompt: `32x32 pixel art carpet tile, color ${BRAND_COLORS.plum}, modern office carpet texture, top-down view, seamless tileable`,
    x: 64,
    y: 0,
    width: 32,
    height: 32,
  },

  // Modern desk
  {
    name: 'modern_desk',
    prompt: `64x64 pixel art modern minimalist office desk, colors ${BRAND_COLORS.plum} and ${BRAND_COLORS.sweetMint}, top-down view, clean design with monitor`,
    x: 0,
    y: 32,
    width: 64,
    height: 64,
  },

  // Ergonomic chair
  {
    name: 'ergonomic_chair',
    prompt: `32x32 pixel art ergonomic office chair, color ${BRAND_COLORS.sweetMint}, top-down view, modern design`,
    x: 128,
    y: 32,
    width: 32,
    height: 32,
  },

  // Meeting table
  {
    name: 'meeting_table_4',
    prompt: `128x96 pixel art modern meeting table for 4 people, colors ${BRAND_COLORS.plum} and white, top-down view, rectangular with chairs around it`,
    x: 0,
    y: 96,
    width: 128,
    height: 96,
  },

  // Meditation cushion
  {
    name: 'meditation_cushion',
    prompt: `32x32 pixel art meditation cushion, color ${BRAND_COLORS.plumStain}, top-down view, round zen meditation pillow`,
    x: 0,
    y: 224,
    width: 32,
    height: 32,
  },

  // Yoga mat
  {
    name: 'yoga_mat',
    prompt: `32x64 pixel art yoga mat, color ${BRAND_COLORS.sweetMint}, top-down view, rolled out meditation mat`,
    x: 32,
    y: 224,
    width: 32,
    height: 64,
  },

  // Guitar
  {
    name: 'acoustic_guitar',
    prompt: `32x64 pixel art acoustic guitar on stand, natural wood color with ${BRAND_COLORS.sweetMint} accents, top-down view`,
    x: 128,
    y: 224,
    width: 32,
    height: 64,
  },

  // Keyboard synth
  {
    name: 'keyboard_synth',
    prompt: `64x32 pixel art electronic keyboard synthesizer, colors ${BRAND_COLORS.plum} and white, top-down view, modern music production keyboard`,
    x: 160,
    y: 224,
    width: 64,
    height: 32,
  },

  // Large plant
  {
    name: 'large_plant',
    prompt: `32x64 pixel art large potted plant, green leaves in ${BRAND_COLORS.sweetMint} pot, top-down view, modern office plant`,
    x: 0,
    y: 288,
    width: 32,
    height: 64,
  },

  // Modern sofa
  {
    name: 'modern_sofa',
    prompt: `96x64 pixel art modern 3-seater sofa, color ${BRAND_COLORS.plum}, top-down view, contemporary office lounge furniture`,
    x: 96,
    y: 288,
    width: 96,
    height: 64,
  },

  // Coffee machine
  {
    name: 'coffee_machine',
    prompt: `32x32 pixel art modern coffee machine, colors ${BRAND_COLORS.plum} and silver, top-down view, espresso maker`,
    x: 0,
    y: 352,
    width: 32,
    height: 32,
  },

  // Refrigerator
  {
    name: 'refrigerator',
    prompt: `32x64 pixel art modern refrigerator, color ${BRAND_COLORS.whitePlum} with ${BRAND_COLORS.plum} handle, top-down view, sleek office kitchen fridge`,
    x: 32,
    y: 352,
    width: 32,
    height: 64,
  },

  // Phone booth
  {
    name: 'phone_booth',
    prompt: `64x64 pixel art modern phone booth, transparent glass with ${BRAND_COLORS.plum} frame, top-down view, contemporary office privacy booth`,
    x: 160,
    y: 352,
    width: 64,
    height: 64,
  },

  // Rently logo wall art
  {
    name: 'rently_logo_wall',
    prompt: `64x32 pixel art Rently logo wall sign, colors ${BRAND_COLORS.plum} and ${BRAND_COLORS.sweetMint}, modern brand signage, text "RENTLY"`,
    x: 96,
    y: 416,
    width: 64,
    height: 32,
  },

  // Whiteboard
  {
    name: 'whiteboard',
    prompt: `64x32 pixel art modern whiteboard, white board with ${BRAND_COLORS.plum} frame, top-down view, office presentation board`,
    x: 160,
    y: 416,
    width: 64,
    height: 32,
  },
];

async function generateSprite(sprite: SpriteRequest): Promise<string | null> {
  try {
    console.log(`Generating ${sprite.name}...`);

    // Step 1: Generate image
    const generateResponse = await fetch(`${KIE_API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIE_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: sprite.prompt,
        size: '1:1', // Square format for sprites
        nVariants: 1,
        isEnhance: true,
      }),
    });

    if (!generateResponse.ok) {
      throw new Error(`API request failed: ${generateResponse.statusText}`);
    }

    const generateData = await generateResponse.json();

    if (generateData.code !== 200) {
      throw new Error(`Generation failed: ${generateData.msg}`);
    }

    const taskId = generateData.data.taskId;

    // Step 2: Check status and get download URL
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

      const statusResponse = await fetch(`${KIE_API_BASE}/record-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KIE_API_KEY}`,
        },
        body: JSON.stringify({ taskId }),
      });

      const statusData = await statusResponse.json();

      if (statusData.data.successFlag === 1) {
        // Success! Return the first image URL
        const imageUrl = statusData.data.response.result_urls[0];
        console.log(`✅ Generated ${sprite.name}`);
        return imageUrl;
      } else if (statusData.data.successFlag === 2) {
        throw new Error('Generation failed');
      }

      attempts++;
      console.log(`⏳ Waiting for ${sprite.name}... (${attempts}/${maxAttempts})`);
    }

    throw new Error('Timeout waiting for generation');
  } catch (error) {
    console.error(`❌ Error generating ${sprite.name}:`, error);
    return null;
  }
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function generateRentlySpritesheet() {
  console.log('🎨 Starting Rently spritesheet generation with Kie.ai...');
  console.log('');

  // Create output directory if it doesn't exist
  const outputDir = path.join(__dirname, '..', 'public', 'sprites', 'spritesheets');
  const tempDir = path.join(__dirname, '..', 'temp', 'sprites');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Generate all sprites
  const generatedSprites: { sprite: SpriteRequest, url: string }[] = [];

  for (let i = 0; i < spriteRequests.length; i++) {
    const sprite = spriteRequests[i];
    console.log(`\n[${i + 1}/${spriteRequests.length}] Generating ${sprite.name}...`);

    const imageUrl = await generateSprite(sprite);
    if (imageUrl) {
      generatedSprites.push({ sprite, url: imageUrl });

      // Save individual sprite for reference
      const imageData = await downloadImage(imageUrl);
      const filename = path.join(tempDir, `${sprite.name}.png`);
      fs.writeFileSync(filename, imageData);
    }
  }

  console.log('\n✨ All sprites generated!');
  console.log(`📁 Individual sprites saved to: ${tempDir}`);
  console.log('\n⚠️  Next steps:');
  console.log('1. Install canvas: npm install canvas');
  console.log('2. Run the sprite compositor to create rently.png');
  console.log('3. Or manually arrange sprites in an image editor following the layout in rently.ts');

  console.log('\n📋 Generated sprites:');
  generatedSprites.forEach(({ sprite }) => {
    console.log(`  - ${sprite.name} (${sprite.width}x${sprite.height}) at position (${sprite.x}, ${sprite.y})`);
  });
}

// Run the generator
generateRentlySpritesheet().catch(console.error);

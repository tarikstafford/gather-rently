/**
 * Creates a placeholder Rently spritesheet with colored rectangles
 * Run with: node scripts/createPlaceholderSprites.js
 */

const fs = require('fs');
const path = require('path');

// You'll need to install canvas: npm install canvas
const { createCanvas } = require('canvas');

const BRAND_COLORS = {
  darkPlum: '#301064',
  plum: '#553081',
  plumStain: '#E1CFFF',
  whitePlum: '#FAF6FF',
  sweetMint: '#11BB8D',
  dolphinGray: '#7A86A9',
};

const canvas = createCanvas(1024, 1024);
const ctx = canvas.getContext('2d');

// Fill background with transparent
ctx.clearRect(0, 0, 1024, 1024);

// Helper function to draw a placeholder sprite
function drawPlaceholder(x, y, width, height, color, label) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);

  // Add border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);

  // Add label
  if (label && width >= 32) {
    ctx.fillStyle = '#000000';
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + width / 2, y + height / 2);
  }
}

// Floor tiles (Row 1)
drawPlaceholder(0, 0, 32, 32, BRAND_COLORS.whitePlum, 'Floor');
drawPlaceholder(32, 0, 32, 32, BRAND_COLORS.plumStain, 'Floor');
drawPlaceholder(64, 0, 32, 32, BRAND_COLORS.plum, 'Carpet');
drawPlaceholder(96, 0, 32, 32, BRAND_COLORS.darkPlum, 'Floor');

// Desks (Row 2)
drawPlaceholder(0, 32, 64, 64, BRAND_COLORS.dolphinGray, 'Desk');
drawPlaceholder(64, 32, 64, 64, BRAND_COLORS.dolphinGray, 'Standing');

// Chairs
drawPlaceholder(128, 32, 32, 32, BRAND_COLORS.sweetMint, 'Chair');
drawPlaceholder(160, 32, 32, 32, BRAND_COLORS.sweetMint, 'Chair');

// Meeting tables
drawPlaceholder(0, 96, 128, 96, BRAND_COLORS.plumStain, 'Table');
drawPlaceholder(128, 96, 160, 128, BRAND_COLORS.plumStain, 'Conf');

// Meditation items (Row 7)
drawPlaceholder(0, 224, 32, 32, BRAND_COLORS.plumStain, 'Cush');
drawPlaceholder(32, 224, 32, 64, BRAND_COLORS.sweetMint, 'Mat');
drawPlaceholder(64, 224, 32, 32, BRAND_COLORS.dolphinGray, 'Zen');
drawPlaceholder(96, 224, 32, 32, BRAND_COLORS.plum, 'Incns');

// Music items
drawPlaceholder(128, 224, 32, 64, '#8B4513', 'Guitar');
drawPlaceholder(160, 224, 64, 32, BRAND_COLORS.darkPlum, 'Keys');
drawPlaceholder(224, 224, 64, 64, BRAND_COLORS.dolphinGray, 'Drums');

// Plants
drawPlaceholder(0, 288, 32, 64, BRAND_COLORS.sweetMint, 'Plant');
drawPlaceholder(32, 288, 32, 32, BRAND_COLORS.sweetMint, 'Plant');
drawPlaceholder(64, 288, 32, 32, BRAND_COLORS.sweetMint, 'Hang');

// Lounge furniture
drawPlaceholder(96, 288, 96, 64, BRAND_COLORS.plum, 'Sofa');
drawPlaceholder(192, 288, 32, 32, BRAND_COLORS.plumStain, 'Bean');
drawPlaceholder(224, 288, 64, 64, BRAND_COLORS.dolphinGray, 'Table');

// Kitchen items
drawPlaceholder(0, 352, 32, 32, BRAND_COLORS.darkPlum, 'Coffee');
drawPlaceholder(32, 352, 32, 64, BRAND_COLORS.whitePlum, 'Fridge');
drawPlaceholder(64, 352, 64, 32, BRAND_COLORS.dolphinGray, 'Counter');
drawPlaceholder(128, 352, 32, 32, BRAND_COLORS.sweetMint, 'Stool');

// Phone booth
drawPlaceholder(160, 352, 64, 64, BRAND_COLORS.plumStain, 'Booth');

// Walls
drawPlaceholder(0, 416, 32, 32, BRAND_COLORS.darkPlum, 'Wall');
drawPlaceholder(32, 416, 32, 32, BRAND_COLORS.darkPlum, 'Wall');
drawPlaceholder(64, 416, 32, 32, BRAND_COLORS.plumStain, 'Glass');

// Decorations
drawPlaceholder(96, 416, 64, 32, BRAND_COLORS.plum, 'RENTLY');
drawPlaceholder(160, 416, 64, 32, BRAND_COLORS.whitePlum, 'Board');
drawPlaceholder(224, 416, 32, 32, BRAND_COLORS.dolphinGray, 'Screen');
drawPlaceholder(256, 416, 32, 64, BRAND_COLORS.plum, 'Shelf');

// Save the canvas
const outputPath = path.join(__dirname, '..', 'public', 'sprites', 'spritesheets', 'rently.png');
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log('✅ Placeholder spritesheet created at:', outputPath);
console.log('🎨 You can now use the "rently" palette in the map editor!');

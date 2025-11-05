// Quick script to show what sprites are available to AI
const fs = require('fs');
const path = require('path');

console.log('📋 Available Sprites for AI Map Generation\n');
console.log('='.repeat(60));

// Read the generated Kenney files
const kenneyFiles = [
  'kenney_city',
  'kenney_buildings',
  'kenney_landscape'
];

let totalObjects = 0;

kenneyFiles.forEach(filename => {
  const filePath = path.join(__dirname, '../utils/pixi/spritesheet', `${filename}.ts`);

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Count sprites with layer: 'object'
    const objectMatches = content.match(/layer: 'object'/g);
    const objectCount = objectMatches ? objectMatches.length : 0;

    // Count floor sprites
    const floorMatches = content.match(/layer: 'floor'/g);
    const floorCount = floorMatches ? floorMatches.length : 0;

    // Extract sprite names (simple regex)
    const nameMatches = content.matchAll(/name: '([^']+)'/g);
    const names = Array.from(nameMatches).map(m => m[1]);

    console.log(`\n📦 ${filename.toUpperCase()}`);
    console.log(`   Total sprites: ${names.length}`);
    console.log(`   Objects: ${objectCount}`);
    console.log(`   Floors: ${floorCount}`);

    if (objectCount > 0) {
      console.log(`   Sample objects: ${names.slice(0, 5).join(', ')}...`);
    }

    totalObjects += objectCount;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`\n✨ TOTAL OBJECTS AVAILABLE TO AI: ${totalObjects}`);
console.log('\nThese sprites are now available for AI map generation!');
console.log('The AI can use sprites from:');
console.log('  • kenney_city');
console.log('  • kenney_buildings');
console.log('  • village');
console.log('\nPreviously only had ~30 sprites from village palette');
console.log(`Now has ${totalObjects}+ objects to work with! 🎉\n`);

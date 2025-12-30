const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

/**
 * Generates PWA icons with "13" text matching the game's visual style
 */
function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // White background (matches HTML background)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Calculate font size based on icon size
  // The "13" should take up about 60% of the icon
  const fontSize = Math.floor(size * 0.5);

  // Use game's font styling: font-weight 900, extra-expanded
  // Note: extra-expanded may not be available, but we'll use bold and adjust
  ctx.font = `900 ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = '#111111';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw "13" in the center
  ctx.fillText('13', size / 2, size / 2);

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, filename), buffer);
  console.log(`✓ Generated ${filename} (${size}x${size})`);
}

// Generate both icon sizes
console.log('Generating PWA icons...');
generateIcon(192, 'icon-192.png');
generateIcon(512, 'icon-512.png');
console.log('✓ Icon generation complete!');

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(process.cwd(), 'public', 'logo.png');

async function analyzeLogo() {
  try {
    const meta = await sharp(inputPath).metadata();
    const width = meta.width;
    const height = meta.height;
    const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
    
    let minX = width, maxX = 0, minY = height, maxY = 0;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * info.channels;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // Dark text / shadow pixels (r, g, b are low, e.g. < 100)
        const isTextOrShadow = (r < 100 && g < 160 && b < 100);
        if (isTextOrShadow) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    
    const logoWidth = maxX - minX;
    const logoHeight = maxY - minY;
    const logoCenterX = minX + logoWidth / 2;
    const logoCenterY = minY + logoHeight / 2;
    
    console.log(`Image Meta: ${width}x${height}`);
    console.log(`Text Bounding Box: X=[${minX}, ${maxX}] (width ${logoWidth}), Y=[${minY}, ${maxY}] (height ${logoHeight})`);
    console.log(`Text Visual Center: X=${logoCenterX}, Y=${logoCenterY}`);
  } catch (err) {
    console.error("Analysis error:", err);
  }
}

analyzeLogo();

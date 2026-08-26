const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const originalPath = 'C:\\Users\\uwais\\Downloads\\tf..png';
const publicLogoPath = path.join(process.cwd(), 'public', 'logo.png');
const publicFaviconPngPath = path.join(process.cwd(), 'public', 'favicon.png');
const publicFaviconIcoPath = path.join(process.cwd(), 'public', 'favicon.ico');
const appIconPath = path.join(process.cwd(), 'src', 'app', 'icon.png');
const appIcoPath = path.join(process.cwd(), 'src', 'app', 'favicon.ico');

async function processAndZoomOutLogo() {
  try {
    const inputPath = fs.existsSync(originalPath) ? originalPath : publicLogoPath;
    
    // Create a 256x256 solid brand green canvas (#3bda71)
    const canvasSize = 256;
    
    // Scale tf' logo text to 105px height so it sits with comfortable green margins (zoomed out)
    const scaledLogo = await sharp(inputPath)
      .resize({ height: 105, fit: 'contain' })
      .toBuffer();

    const finalImage = await sharp({
      create: {
        width: canvasSize,
        height: canvasSize,
        channels: 4,
        background: { r: 59, g: 218, b: 113, alpha: 1 }
      }
    })
    .composite([{ input: scaledLogo, gravity: 'center' }])
    .png()
    .toBuffer();

    fs.writeFileSync(publicLogoPath, finalImage);
    fs.writeFileSync(publicFaviconPngPath, finalImage);
    fs.writeFileSync(publicFaviconIcoPath, finalImage);
    fs.writeFileSync(appIconPath, finalImage);
    fs.writeFileSync(appIcoPath, finalImage);

    console.log("Logo zoomed out with generous green margin & perfect centering!");
  } catch (err) {
    console.error("Error zooming out logo:", err);
  }
}

processAndZoomOutLogo();

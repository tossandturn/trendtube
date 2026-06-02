const sharp = require('sharp');
const fs = require('fs');

const svgBuffer = fs.readFileSync('./favicon.svg');

async function generateIcons() {
  // 16x16
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile('favicon-16x16.png');
  console.log('Generated favicon-16x16.png');

  // 32x32
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('favicon-32x32.png');
  console.log('Generated favicon-32x32.png');

  // 180x180 (Apple touch icon)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('apple-touch-icon.png');
  console.log('Generated apple-touch-icon.png');

  // 192x192 (Android Chrome)
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('android-chrome-192x192.png');
  console.log('Generated android-chrome-192x192.png');

  // 512x512 (PWA)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('android-chrome-512x512.png');
  console.log('Generated android-chrome-512x512.png');

  console.log('All icons generated!');
}

generateIcons().catch(console.error);

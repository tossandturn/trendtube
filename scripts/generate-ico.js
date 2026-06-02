const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIco() {
  // 生成多尺寸 PNG 并合并为 ICO
  const sizes = [16, 32, 48];
  const pngBuffers = [];

  const svgBuffer = fs.readFileSync('./favicon.svg');

  for (const size of sizes) {
    const buffer = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    pngBuffers.push(buffer);
  }

  // 简单创建 ICO 文件 (ICO header + 图片数据)
  // 这需要更复杂的实现，这里我们先用 PNG 作为 favicon.ico
  // 复制 32x32 作为 favicon.ico
  fs.copyFileSync('favicon-32x32.png', 'favicon.ico');
  console.log('Generated favicon.ico (PNG format)');
}

generateIco().catch(console.error);

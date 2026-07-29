const fs = require('fs');
const path = require('path');

const logFile = 'C:/Users/CH FAIZAN/.gemini/antigravity/brain/6b310d5f-ce6b-4098-af96-afa9aae929d2/.system_generated/steps/1641/output.txt';
const content = fs.readFileSync(logFile, 'utf8');
const jsonStart = content.indexOf('[');
const jsonStr = content.substring(jsonStart);
const svgs = JSON.parse(jsonStr);

const outDir = 'C:/Users/CH FAIZAN/.gemini/antigravity/scratch/ies-navbar-hero/public/images/data_ai_exact';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

svgs.forEach((svg, idx) => {
  const fileName = `logo${idx + 1}.svg`;
  fs.writeFileSync(path.join(outDir, fileName), svg, 'utf8');
});

console.log(`Successfully saved ${svgs.length} exact Data & AI SVG files to public/images/data_ai_exact!`);

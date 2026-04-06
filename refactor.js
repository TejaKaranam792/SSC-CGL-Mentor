const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  if (filePath.includes('BadgeDisplay.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let orig = content;

  // Background replacements
  content = content.replace(/bg-\[\#0B0B0F\](\/[0-9]+|\\\/\[[0-9\.]+\])?/g, 'bg-background');
  content = content.replace(/bg-\[\#12121A\](\/[0-9]+|\\\/\[[0-9\.]+\])?/g, 'bg-card');
  content = content.replace(/bg-\[\#1A1A26\](\/[0-9]+|\\\/\[[0-9\.]+\])?/g, 'bg-muted');

  // Specific text replacements
  content = content.replace(/text-\[\#F0F0F8\]/g, 'text-foreground');
  content = content.replace(/text-\[\#E0E0E8\]/g, 'text-foreground');
  content = content.replace(/text-\[\#6A6A7A\]/g, 'text-muted-foreground');
  content = content.replace(/text-\[\#B0B0C0\]/g, 'text-slate-400');
  
  // Primary (Gold -> Blue substitution via token)
  content = content.replace(/text-\[\#D4AF37\](\/[0-9]+|\\\/\[[0-9\.]+\])?/g, 'text-primary');
  content = content.replace(/bg-\[\#D4AF37\](\/[0-9]+|\\\/\[[0-9\.]+\])?/g, 'bg-primary');
  content = content.replace(/border-\[\#D4AF37\](\/[0-9]+|\\\/\[[0-9\.]+\])?/g, 'border-primary/50');
  
  // Borders
  content = content.replace(/border-white\/\[[0-9\.]+\]/g, 'border-border');
  content = content.replace(/border-white\/[0-9]+/g, 'border-border');
  
  // Shadows & Blurs removals
  content = content.replace(/shadow-\[0_0_[^\]]+\]/g, 'shadow-sm');
  content = content.replace(/blur-\[[0-9]+px\]/g, 'hidden'); // hide ambient orbs
  
  // Misc Gradients
  content = content.replace(/from-\[\#D4AF37\](\/[0-9]+|\\\/\[[0-9\.]+\])?/g, 'from-primary/10');
  content = content.replace(/via-\[\#D4AF37\](\/[0-9]+|\\\/\[[0-9\.]+\])?/g, 'via-primary/20');
  
  // Replace the literal D4AF37 hex used in SVG JS components (like TimerRing, AccuracyRing)
  content = content.replace(/'#D4AF37'/g, "'#3B82F6'"); // Primary Blue
  content = content.replace(/"#D4AF37"/g, '"#3B82F6"'); 
  content = content.replace(/rgba\(212,\s*175,\s*55,/g, 'rgba(59,130,246,');

  if (content !== orig) {
    fs.writeFileSync(filePath, content);
  }
});
console.log('Script ran successfully');

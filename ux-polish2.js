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
  
  let content = fs.readFileSync(filePath, 'utf8');
  let orig = content;

  // 1. Fix the blank overlapping block (bg-primary with text-[11px]... text-primary)
  // Which makes text completely invisible matching the background. 
  // We want: bg-primary/10 border-primary/20 text-xs font-semibold tracking-wide text-primary mb-2
  content = content.replace(/bg-primary border border-border rounded-full text-\[11px\] font-black tracking-\[0\.18em\] text-primary uppercase/g, 'bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold tracking-wide text-primary');
  content = content.replace(/bg-primary border border-primary\/50 rounded-full text-\[11px\] font-black tracking-\[0\.18em\] text-primary uppercase/g, 'bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold tracking-wide text-primary');
  
  content = content.replace(/bg-primary border border-border text-\[11px\] font-black tracking-\[0\.18em\] text-primary uppercase/g, 'bg-primary/10 border border-primary/20 text-xs font-semibold tracking-wide text-primary');
  
  // Also any other "tracking-[0.18em]" which is very aggressive
  content = content.replace(/font-black tracking-\[0\.18em\] uppercase/g, 'font-semibold tracking-wide');
  content = content.replace(/tracking-\[0\.18em\] uppercase/g, 'tracking-wide');
  
  // 3. UI/UX Typography softening (converting aggressive royal fonts to clean modern edu fonts)
  // Eradicate `text-[11px]` and replace with `text-xs`
  content = content.replace(/text-\[11px\]/g, 'text-xs');
  content = content.replace(/text-\[10px\]/g, 'text-[11px]');
  content = content.replace(/text-\[9px\]/g, 'text-[10px]');
  
  // Soften remaining "font-black" and "tracking-widest"
  content = content.replace(/font-black uppercase tracking-widest text/g, 'font-bold uppercase tracking-wide text');
  content = content.replace(/font-black text-foreground mb-4 uppercase tracking-widest/g, 'font-bold text-foreground mb-4 tracking-wide');
  content = content.replace(/tracking-widest uppercase/g, 'tracking-wide font-semibold');
  content = content.replace(/uppercase tracking-widest/g, 'uppercase tracking-wide font-semibold');
  

  if (content !== orig) {
    fs.writeFileSync(filePath, content);
  }
});
console.log('Final UX Polish complete');

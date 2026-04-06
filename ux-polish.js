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

  // 1. Remove left-over hover gold
  content = content.replace(/hover:bg-\[\#EDD060\]/g, 'hover:bg-blue-600');
  content = content.replace(/hover:text-\[\#EDD060\]/g, 'hover:text-blue-600');

  // 2. Fix the manual slider styling in InputForm.tsx/Readiness
  content = content.replace(/#D4AF37/g, '#3B82F6');
  content = content.replace(/#EDD060/g, '#60A5FA'); // Lighter blue for slider gradient

  // 3. UI/UX Typography softening (converting aggressive royal fonts to clean modern edu fonts)
  content = content.replace(/tracking-widest uppercase text-\[11px\] font-black/g, 'text-xs font-bold text-muted-foreground');
  content = content.replace(/text-\[9px\] font-black text-muted-foreground uppercase tracking-widest/g, 'text-xs font-semibold text-muted-foreground');
  content = content.replace(/text-\[9px\] font-black text-primary uppercase tracking-widest/g, 'text-xs font-bold text-primary');
  content = content.replace(/text-\[11px\] font-black text-muted-foreground uppercase tracking-widest/g, 'text-sm font-semibold text-muted-foreground');
  
  // 4. Improve Primary buttons (they heavily used text-black because it was black text on Gold)
  // Now it's Blue background, so we want white text.
  content = content.replace(/bg-primary hover:bg-blue-600 text-black/g, 'bg-primary hover:bg-blue-600 text-white');
  content = content.replace(/bg-primary text-black shadow-sm/g, 'bg-primary text-white shadow-sm');
  content = content.replace(/text-black font-black uppercase tracking-widest text-sm/g, 'text-white font-bold text-sm tracking-wide');
  content = content.replace(/text-black/g, 'text-primary-foreground');

  // 5. Clean up overly decorated borders and transparent gradients (Unacademy is flat)
  content = content.replace(/border border-primary\/50/g, 'border border-border');
  content = content.replace(/via-primary\/20/g, 'via-transparent');
  content = content.replace(/from-primary\/10/g, 'from-transparent');
  
  // 6. Rounding - softer cards
  content = content.replace(/rounded-\[1\.75rem\]/g, 'rounded-2xl');
  content = content.replace(/rounded-\[1\.25rem\]/g, 'rounded-xl');
  content = content.replace(/rounded-\[1\.5rem\]/g, 'rounded-2xl');

  if (content !== orig) {
    fs.writeFileSync(filePath, content);
  }
});
console.log('UI/UX Polish complete');

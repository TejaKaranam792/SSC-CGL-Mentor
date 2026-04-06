const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      callback(dirPath);
    }
  });
}

const replacements = [
  // InputForm.tsx & TopicSelector forms (Selected states)
  {
    regex: /bg-primary border-primary\/50 text-primary/g,
    replace: 'bg-primary/20 border-primary/40 text-primary'
  },
  {
    regex: /bg-primary text-primary border border-border/g,
    replace: 'bg-primary/20 text-primary border-primary/40'
  },
  {
    regex: /bg-primary border border-border text-primary/g,
    replace: 'bg-primary/20 border border-primary/40 text-primary'
  },
  {
    regex: /bg-primary text-primary border border-primary\/50/g,
    replace: 'bg-primary/20 text-primary border-primary/40'
  },
  {
    regex: /bg-primary text-primary cursor-not-allowed/g,
    replace: 'bg-primary/50 text-white/50 cursor-not-allowed'
  },
  {
    regex: /bg-primary text-primary/g,
    replace: 'bg-primary/10 text-primary'
  },
  {
    regex: /text-primary bg-primary/g,
    replace: 'text-primary bg-primary/10'
  },
  // ResultAnalysis.tsx Dynamic Mapping Fix
  {
    regex: /color: 'text-primary',   bg: 'bg-primary',  border: 'border-primary\/50'/g,
    replace: "color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20'"
  },
  {
    regex: /color: 'text-primary', bg: 'bg-primary', border: 'border-primary\/50'/g,
    replace: "color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20'"
  },
  // InputForm Error Color (Mistake Options)
  {
    regex: /amber:\  'border-primary\/50  bg-primary  text-primary  shadow-sm'/g,
    replace: "amber: 'border-primary/40 bg-primary/20 text-primary shadow-sm'"
  }
];

let changedFiles = 0;

walkDir('./src', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let orig = content;

  replacements.forEach(({ regex, replace }) => {
    content = content.replace(regex, replace);
  });

  if (content !== orig) {
    fs.writeFileSync(filePath, content);
    changedFiles++;
    console.log(`Patched overlaps in ${filePath}`);
  }
});

console.log(`Finished patching ${changedFiles} files with blue text overlaps.`);

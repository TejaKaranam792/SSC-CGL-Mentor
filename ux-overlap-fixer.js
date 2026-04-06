const fs = require('fs');

const replacements = [
  {
    file: 'src/components/readiness/TestEngine.tsx',
    search: 'bg-primary border border-border text-primary text-[11px] font-black tracking-wide font-semibold rounded-full',
    replace: 'bg-primary/10 border border-primary/20 text-primary text-xs tracking-wide font-semibold rounded-full'
  },
  {
    file: 'src/components/readiness/TestEngine.tsx',
    search: 'bg-primary border border-border rounded-2xl text-sm font-bold text-primary hover:bg-primary',
    replace: 'bg-primary hover:bg-blue-600 rounded-2xl text-sm font-bold text-white shadow-sm'
  },
  {
    file: 'src/components/MentorResponseCards.tsx',
    search: 'bg-primary border border-border text-primary',
    replace: 'bg-primary/10 border border-primary/20 text-primary'
  },
  {
    file: 'src/app/report/[id]/page.tsx',
    search: 'bg-primary hover:bg-primary border border-border rounded-2xl font-bold text-primary',
    replace: 'bg-primary hover:bg-blue-600 rounded-2xl font-bold text-white shadow-sm'
  },
  {
    file: 'src/app/report/[id]/page.tsx',
    search: 'bg-primary border border-border hover:bg-primary hover:border-primary/50 rounded-2xl text-primary font-bold text-sm transition-all',
    replace: 'bg-primary border border-transparent hover:bg-blue-600 rounded-2xl text-white font-bold text-sm transition-all shadow-sm'
  },
  {
    file: 'src/app/readiness/test/page.tsx',
    search: 'bg-primary border border-border rounded-2xl text-primary font-black text-sm transition-all hover:bg-primary uppercase tracking-wide font-semibold',
    replace: 'bg-primary rounded-2xl text-white font-bold text-sm transition-all hover:bg-blue-600 tracking-wide shadow-sm'
  },
  {
    file: 'src/app/readiness/results/[sessionId]/page.tsx',
    search: 'bg-primary border border-border rounded-full text-[11px] font-black tracking-[0.18em] text-primary uppercase mb-3',
    replace: 'bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold tracking-wide text-primary mb-3'
  },
  {
    file: 'src/app/history/page.tsx',
    search: 'bg-primary border border-border rounded-2xl text-primary hover:bg-primary transition-all text-sm font-bold',
    replace: 'bg-primary rounded-2xl text-white hover:bg-blue-600 transition-all text-sm font-bold shadow-sm'
  }
];

let changedCount = 0;

replacements.forEach(({ file, search, replace }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(search)) {
      content = content.replace(search, replace);
      fs.writeFileSync(file, content);
      changedCount++;
      console.log(`Fixed in ${file}`);
    } else {
      console.log(`Not found in ${file}: \\n  ${search}`);
    }
  }
});

console.log(`Overlap fix completed. Changed ${changedCount} files.`);

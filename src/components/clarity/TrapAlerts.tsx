"use client";

import { SYLLABUS } from "@/lib/syllabus-data";
import { AlertTriangle } from "lucide-react";

export function TrapAlerts() {
  const traps = SYLLABUS.filter(t => t.isTrap);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-rose-500" />
        <h3 className="text-sm font-black text-foreground uppercase tracking-wide font-semibold">High-Risk Traps</h3>
      </div>
      <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-2xl">
        Beginners often waste months on these topics because they seem "important", but they have extremely low guaranteed marks relative to the effort required. Leave them for later.
      </p>

      <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
        {traps.map(trap => (
          <div key={trap.id} className="snap-start shrink-0 w-72 bg-gradient-to-br from-rose-500/10 to-[#12121A] border border-rose-500/20 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 hidden rounded-full pointer-events-none" />
            
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/20 text-[10px] font-black tracking-wide font-semibold text-rose-400 mb-4">
              <AlertTriangle className="w-3 h-3" /> Warning
            </div>
            
            <h4 className="text-sm font-black text-foreground mb-1">{trap.topicLabel}</h4>
            <div className="text-[11px] font-bold text-primary mb-3">{trap.subject} Section</div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              {trap.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { SYLLABUS } from "@/lib/syllabus-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function WeightageChart() {
  const [metric, setMetric] = useState<'weightage' | 'roiScore'>('weightage');

  // Top 10 topics based on metric
  const data = [...SYLLABUS]
    .sort((a, b) => b[metric] - a[metric])
    .slice(0, 10)
    .map(t => ({
      name: t.topicLabel,
      subject: t.subject,
      score: t[metric],
      roiLevel: t.roiLevel
    }));

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide font-semibold">Priority Visualizer</h3>
          <p className="text-xs text-muted-foreground mt-1">Top 10 sections giving the most returns.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted rounded-xl p-1 border border-border">
          <button
            onClick={() => setMetric('weightage')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
              metric === 'weightage' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            By Weightage
          </button>
          <button
            onClick={() => setMetric('roiScore')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
              metric === 'roiScore' ? "bg-emerald-500/20 text-emerald-400" : "text-muted-foreground hover:text-foreground"
            )}
          >
            By ROI Score
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={140}
              tick={{ fill: '#B0B0C0', fontSize: 11, fontWeight: 600 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-muted border border-border rounded-xl p-3 shadow-2xl">
                    <p className="text-xs font-black text-foreground mb-1">{d.name}</p>
                    <p className="text-[11px] text-primary mb-2">{d.subject}</p>
                    <p className="text-xs text-muted-foreground font-bold">
                      {metric === 'weightage' ? `Weightage Score: ${d.score}/10` : `ROI Engine Score: ${d.score}`}
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((entry, index) => {
                let fill = '#3A3A4A'; // default
                if (metric === 'roiScore') {
                  fill = entry.roiLevel === 'High' ? '#10b981' : entry.roiLevel === 'Medium' ? '#f59e0b' : '#ef4444';
                } else {
                  fill = '#3B82F6';
                }
                return <Cell key={`cell-${index}`} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

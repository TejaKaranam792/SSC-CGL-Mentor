"use client";

interface TimerRingProps {
  totalSeconds: number;
  secondsLeft: number;
  size?: number;
}

export function TimerRing({ totalSeconds, secondsLeft, size = 96 }: TimerRingProps) {
  const r = (size / 2) - 7;
  const circumference = 2 * Math.PI * r;
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1;
  const dashOffset = circumference * (1 - progress);

  const pct = progress * 100;
  const color = pct > 40 ? '#3B82F6' : pct > 20 ? '#f97316' : '#ef4444';
  const glow  = pct > 40 ? 'rgba(59,130,246,0.6)' : pct > 20 ? 'rgba(249,115,22,0.6)' : 'rgba(239,68,68,0.8)';
  const isPulsing = pct <= 20;

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size} height={size}
        className={isPulsing ? 'animate-pulse' : ''}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6}
        />
        {/* Progress */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
            filter: `drop-shadow(0 0 6px ${glow})`,
          }}
        />
      </svg>
      {/* Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: 'none' }}>
        <span className="font-black tabular-nums leading-none text-foreground" style={{ fontSize: size * 0.22 }}>
          {mins}:{secs}
        </span>
        <span className="text-muted-foreground font-bold uppercase tracking-wide font-semibold" style={{ fontSize: size * 0.09 }}>
          left
        </span>
      </div>
    </div>
  );
}

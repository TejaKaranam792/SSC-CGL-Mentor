import { getHistory, getBestStreak, syncBadges } from './storage';

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const ALL_BADGES: Badge[] = [
  { id: 'first_blood',    name: 'First Blood',        desc: 'Logged your very first test',        icon: '🎯', rarity: 'common'    },
  { id: 'century',        name: 'Century Club',        desc: 'Scored 100+ on a Full Mock',          icon: '💯', rarity: 'common'    },
  { id: 'elite_150',      name: 'Elite 150',           desc: 'Scored 150+ on a Full Mock',          icon: '🏆', rarity: 'rare'      },
  { id: 'topper',         name: 'Rank 1 Material',     desc: 'Scored 180+ on a Full Mock',          icon: '👑', rarity: 'legendary' },
  { id: 'streak_5',       name: '5-Day Warrior',       desc: '5-day consecutive test streak',       icon: '🔥', rarity: 'rare'      },
  { id: 'streak_10',      name: '10-Day Legend',       desc: '10 straight days of grinding',        icon: '⚔️', rarity: 'epic'      },
  { id: 'grind_machine',  name: 'Grind Machine',       desc: 'Logged 10+ tests total',              icon: '📚', rarity: 'common'    },
  { id: 'diamond',        name: 'Diamond Aspirant',    desc: 'Logged 25+ tests total',              icon: '💎', rarity: 'epic'      },
  { id: 'accuracy_king',  name: 'Accuracy King',       desc: 'Scored 85%+ on a Full Mock',          icon: '🎰', rarity: 'rare'      },
];

export const RARITY_STYLES: Record<Badge['rarity'], { border: string; glow: string; label: string }> = {
  common:    { border: 'border-border',           glow: '',                                    label: 'Common'    },
  rare:      { border: 'border-indigo-500/40',      glow: 'shadow-sm',  label: 'Rare'      },
  epic:      { border: 'border-purple-500/50',      glow: 'shadow-sm',  label: 'Epic'      },
  legendary: { border: 'border-primary/50',       glow: 'shadow-sm',  label: 'Legendary' },
};

export const checkAndSyncBadges = (): string[] => {
  const history = getHistory();
  const bestStreak = getBestStreak();
  const earned: string[] = [];

  if (history.length >= 1) earned.push('first_blood');
  if (history.some(h => h.testType === 'full' && h.totalScore >= 100)) earned.push('century');
  if (history.some(h => h.testType === 'full' && h.totalScore >= 150)) earned.push('elite_150');
  if (history.some(h => h.testType === 'full' && h.totalScore >= 180)) earned.push('topper');
  if (bestStreak >= 5) earned.push('streak_5');
  if (bestStreak >= 10) earned.push('streak_10');
  if (history.length >= 10) earned.push('grind_machine');
  if (history.length >= 25) earned.push('diamond');
  if (history.some(h => h.testType === 'full' && h.totalScore / 200 >= 0.85)) earned.push('accuracy_king');

  syncBadges(earned);
  return earned;
};

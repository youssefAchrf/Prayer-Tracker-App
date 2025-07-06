import React from 'react';
import { View } from 'react-native';
import { Award } from 'lucide-react-native'; // Changed from Flame to Award

interface StreakBadgeProps {
  streak: number;
  size?: number;
}

// This component dynamically determines which badge to show based on the streak count.
export function StreakBadge({ streak, size = 18 }: StreakBadgeProps) {
  let badgeColor: string | null = null;

  if (streak >= 30) {
    badgeColor = '#ffd700'; // Gold
  } else if (streak >= 20) {
    badgeColor = '#c0c0c0'; // Silver
  } else if (streak >= 10) {
    badgeColor = '#cd7f32'; // Bronze
  }

  // If the streak is not high enough for any badge, render nothing.
  if (!badgeColor) {
    return null;
  }

  return (
    <View>
      {/* Changed from Flame to Award to look more like a medal */}
      <Award size={size} color={badgeColor} fill={badgeColor} />
    </View>
  );
}

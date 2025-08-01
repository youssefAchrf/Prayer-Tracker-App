// components/PrayerProgressDial.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Sun, Moon, Sunrise, Sunset, CloudSun } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const PRAYER_ICONS = [
  { Icon: Sunrise },
  { Icon: Sun },
  { Icon: CloudSun },
  { Icon: Sunset },
  { Icon: Moon },
];

interface PrayerProgressDialProps {
  prayersCompleted: number;
  totalPrayers: number;
  size?: number;
  strokeWidth?: number;
}

export function PrayerProgressDial({
  prayersCompleted,
  totalPrayers,
  size = 150,
  strokeWidth = 15,
}: PrayerProgressDialProps) {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = totalPrayers > 0 ? (prayersCompleted / totalPrayers) * 100 : 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // --- FIX: The iconRadius is now smaller than the main radius to place icons inside ---
  const iconRadius = radius - strokeWidth / 2 - 10; 
  const center = size / 2;

  const progressAngle = (percentage / 100) * 360;
  const handleAngleRad = (progressAngle - 90) * (Math.PI / 180);
  const handleX = center + radius * Math.cos(handleAngleRad);
  const handleY = center + radius * Math.sin(handleAngleRad);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
        {/* Handle at the end of the arc */}
        {percentage > 0 && percentage < 100 && (
          <Circle cx={handleX} cy={handleY} r={strokeWidth / 2 - 2} fill={colors.card} stroke={colors.primary} strokeWidth={2}/>
        )}
      </Svg>

      {/* Center Text */}
      <View style={styles.content}>
        <Text style={styles.valueText}>{prayersCompleted}/{totalPrayers}</Text>
        <Text style={styles.labelText}>Completed</Text>
      </View>

      {/* Prayer Icons positioned around the dial */}
      {PRAYER_ICONS.map((item, index) => {
        const angle = (360 / totalPrayers) * index - 90;
        const angleRad = angle * (Math.PI / 180);
        const iconX = center + iconRadius * Math.cos(angleRad);
        const iconY = center + iconRadius * Math.sin(angleRad);
        const isCompleted = index < prayersCompleted;

        return (
          <View
            key={index}
            style={[
              styles.iconWrapper,
              { 
                left: iconX - 10, // Adjust for new icon size
                top: iconY - 10,  // Adjust for new icon size
              },
            ]}
          >
            <item.Icon size={14} color={isCompleted ? colors.primary : colors.textSecondary} />
          </View>
        );
      })}
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: colors.text,
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.textSecondary,
    marginTop: 4,
  },
  iconWrapper: {
    position: 'absolute',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
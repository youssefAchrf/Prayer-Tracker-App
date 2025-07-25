import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export function AnimatedSplashScreen({ onAnimationFinish }: { onAnimationFinish: () => void }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LottieView
        source={require('@/assets/splash-animation.json')} // Ensure this path is correct
        autoPlay
        loop={false}
        resizeMode="cover"
        onAnimationFinish={onAnimationFinish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
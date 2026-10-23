import React from 'react';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AP = Animated.createAnimatedComponent(Pressable);

export default function Pressy({ children, style, onPress, scaleTo = 0.94, ...rest }) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <AP
      onPressIn={() => (s.value = withSpring(scaleTo, { damping: 15 }))}
      onPressOut={() => (s.value = withSpring(1, { damping: 12 }))}
      onPress={onPress}
      style={[style, a]}
      {...rest}
    >
      {children}
    </AP>
  );
}

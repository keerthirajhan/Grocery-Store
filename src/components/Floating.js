import React, { useEffect } from 'react';
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming,
} from 'react-native-reanimated';

export default function Floating({ children, amount = 10, duration = 1800, delay = 0, rotate = 0, style }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1
      )
    );
  }, []);
  const a = useAnimatedStyle(() => ({
    transform: [{ translateY: -amount * v.value }, { rotate: `${rotate * v.value}deg` }],
  }));
  return <Animated.View style={[style, a]}>{children}</Animated.View>;
}

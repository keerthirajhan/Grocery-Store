import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme';

export const money = (n) => `Rs ${Math.round(n).toLocaleString('en-IN')}`;

export function Bar({ pct, color = colors.olive, height = 8, delay = 0 }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withDelay(delay, withTiming(Math.max(2, Math.min(100, pct)), { duration: 700 }));
  }, [pct]);
  const a = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <Animated.View style={[{ height, borderRadius: height / 2, backgroundColor: color }, a]} />
    </View>
  );
}

export function Card({ children, style, delay = 0 }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify().damping(16)} style={[styles.card, style]}>
      {children}
    </Animated.View>
  );
}

export function SectionTitle({ title, hint, icon }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.section}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : icon ? <Ionicons name={icon} size={18} color={colors.muted} /> : null}
    </View>
  );
}

export function Kpi({ icon, label, value, tone = colors.olive, delay = 0 }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).springify().damping(16)} style={styles.kpi}>
      <View style={[styles.kpiIcon, { backgroundColor: tone + '1F' }]}>
        <Ionicons name={icon} size={18} color={tone} />
      </View>
      <Text style={styles.kpiValue} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  track: { flex: 1, backgroundColor: '#E3ECE6', overflow: 'hidden' },
  card: { backgroundColor: colors.card, borderRadius: 24, padding: 16, marginHorizontal: 16, marginBottom: 14, ...shadow },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  section: { fontSize: 16, fontWeight: '800', color: colors.text },
  hint: { fontSize: 12, color: colors.muted, fontWeight: '600' },
  kpi: { flex: 1, backgroundColor: colors.card, borderRadius: 20, padding: 12, ...shadow },
  kpiIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  kpiValue: { fontSize: 18, fontWeight: '900', color: colors.text },
  kpiLabel: { fontSize: 11, color: colors.muted, fontWeight: '600', marginTop: 2 },
});

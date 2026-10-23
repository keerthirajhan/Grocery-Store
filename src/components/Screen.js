import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow } from '../theme';
import Pressy from './Pressy';

export function Screen({ children, style }) {
  return (
    <LinearGradient colors={[colors.gradTop, '#F0F5E3', colors.gradBottom]} style={styles.flex}>
      <View style={styles.circleA} />
      <View style={styles.circleB} />
      <SafeAreaView style={[styles.flex, style]} edges={['top']}>{children}</SafeAreaView>
    </LinearGradient>
  );
}

export function RoundBtn({ icon, onPress, color = colors.text }) {
  return (
    <Pressy style={styles.round} onPress={onPress}>
      <Ionicons name={icon} size={20} color={color} />
    </Pressy>
  );
}

export function Header({ title, subtitle, left, right, big }) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>{left}</View>
      <View style={{ flex: 1 }}>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <Text style={[styles.title, big && styles.big]}>{title}</Text>
      </View>
      <View style={[styles.side, { justifyContent: 'flex-end' }]}>{right}</View>
    </View>
  );
}

export function PrimaryButton({ label, onPress, style, disabled, icon }) {
  return (
    <Pressy style={[styles.btn, disabled && { opacity: 0.5 }, style]} onPress={disabled ? undefined : onPress}>
      <Text style={styles.btnText}>{label}</Text>
      {icon ? <Ionicons name={icon} size={18} color="#fff" /> : null}
    </Pressy>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  circleA: { position: 'absolute', top: -80, right: -60, width: 230, height: 230, borderRadius: 115, backgroundColor: 'rgba(255,255,255,0.28)' },
  circleB: { position: 'absolute', bottom: 120, left: -90, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(85,120,31,0.08)' },
  round: {
    width: 42, height: 42, borderRadius: 15, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', ...shadow,
  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12 },
  side: { width: 52, flexDirection: 'row', gap: 8 },
  title: { textAlign: 'center', fontSize: 20, fontWeight: '800', color: colors.text },
  subtitle: { textAlign: 'center', fontSize: 12, color: colors.muted, fontWeight: '600' },
  big: { textAlign: 'center', fontSize: 22, lineHeight: 26 },
  btn: {
    backgroundColor: colors.olive, borderRadius: 26, paddingVertical: 15, flexDirection: 'row',
    gap: 8, alignItems: 'center', justifyContent: 'center', ...shadow,
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: 0.3 },
});

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [t, setT] = useState(null);
  const timer = useRef();
  const insets = useSafeAreaInsets();

  const show = useCallback((message, type = 'success') => {
    clearTimeout(timer.current);
    setT({ message, type, key: Date.now() });
    timer.current = setTimeout(() => setT(null), 2200);
  }, []);

  const ok = !t || t.type === 'success';
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {t && (
        <Animated.View
          key={t.key}
          entering={FadeInUp.springify().damping(14)}
          exiting={FadeOutUp}
          pointerEvents="none"
          style={[styles.wrap, { top: insets.top + 10 }]}
        >
          <View style={[styles.pill, { backgroundColor: ok ? '#1E2A12' : '#7A1523' }]}>
            <View style={[styles.icon, { backgroundColor: ok ? colors.green : colors.red }]}>
              <Ionicons name={ok ? 'checkmark' : 'alert'} size={14} color="#fff" />
            </View>
            <Text style={styles.text}>{t.message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastCtx.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 20, right: 20, alignItems: 'center', zIndex: 999 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 12, elevation: 8, maxWidth: 360,
  },
  icon: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontWeight: '600', fontSize: 14, flexShrink: 1 },
});

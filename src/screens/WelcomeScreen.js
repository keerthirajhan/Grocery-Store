import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../components/Screen';
import Pressy from '../components/Pressy';
import Floating from '../components/Floating';
import { colors } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.hero}>
        <Animated.View entering={ZoomIn.duration(700)} style={styles.halo} />
        <Animated.Text entering={FadeIn.delay(100)} style={[styles.spark, { top: '18%', left: '14%' }]}>✨</Animated.Text>
        <Animated.Text entering={FadeIn.delay(300)} style={[styles.spark, { top: '26%', right: '12%' }]}>🌿</Animated.Text>
        <Floating amount={12} duration={1800}>
          <Image source={require('../../assets/products/pineapple.jpg')} style={styles.big} />
        </Floating>
        <View style={styles.fruitRow}>
          <Floating amount={10} duration={1500} delay={200}><Image source={require('../../assets/products/orange.jpg')} style={styles.small} /></Floating>
          <Floating amount={12} duration={1900} delay={500}><Image source={require('../../assets/products/tomato.jpg')} style={styles.small} /></Floating>
          <Floating amount={10} duration={1600} delay={800}><Image source={require('../../assets/products/grapes.jpg')} style={styles.small} /></Floating>
        </View>
      </View>

      <Animated.View entering={FadeInDown.delay(250).springify().damping(15)} style={styles.bottom}>
        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.bar} />
        </View>
        <Text style={styles.title}>Grocery Shop</Text>
        <Text style={styles.sub}>The easiest way to buy your{'\n'}grocery shopping</Text>
        <Pressy style={styles.pill} onPress={() => navigation.navigate('Auth', { mode: 'signup' })} scaleTo={0.97}>
          <View style={styles.pillArrow}><Ionicons name="arrow-forward" size={22} color={colors.olive} /></View>
          <Text style={styles.pillText}>Get Started</Text>
        </Pressy>
        <View style={styles.links}>
          <Text style={styles.sep}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Auth', { mode: 'signin' })}>
            <Text style={styles.link}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(255,255,255,0.45)' },
  spark: { position: 'absolute', fontSize: 28 },
  big: { width: 210, height: 210, borderRadius: 105, borderWidth: 6, borderColor: '#fff' },
  fruitRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 14, marginTop: 18 },
  small: { width: 82, height: 82, borderRadius: 41, borderWidth: 4, borderColor: '#fff' },
  bottom: { paddingHorizontal: 24, paddingBottom: 34, alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 4, marginBottom: 14, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#222' },
  bar: { width: 34, height: 6, borderRadius: 3, backgroundColor: '#222' },
  title: { fontSize: 30, fontWeight: '900', color: colors.text, letterSpacing: 0.5 },
  sub: { textAlign: 'center', color: colors.muted, fontSize: 16, lineHeight: 22, marginVertical: 8, marginBottom: 22 },
  pill: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.olive, borderRadius: 34, padding: 6, shadowColor: '#2c3d10', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  pillArrow: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  pillText: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '800', fontSize: 17, marginRight: 52 },
  links: { flexDirection: 'row', gap: 6, marginTop: 18 },
  link: { color: colors.oliveDark, fontWeight: '800', fontSize: 14 },
  sep: { color: colors.muted, fontSize: 14 },
});

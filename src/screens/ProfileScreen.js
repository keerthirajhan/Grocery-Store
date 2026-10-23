import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, RoundBtn, PrimaryButton } from '../components/Screen';
import { useApp } from '../context/AppContext';
import { colors, shadow } from '../theme';

const Row = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}><Ionicons name={icon} size={18} color={colors.oliveDark} /></View>
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'Not provided'}</Text>
    </View>
  </View>
);

const Stat = ({ icon, n, label, color }) => (
  <View style={styles.stat}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={styles.statN}>{n}</Text>
    <Text style={styles.statL}>{label}</Text>
  </View>
);

export default function ProfileScreen({ navigation }) {
  const { user, signOut, favorites, cartCount, orders } = useApp();
  return (
    <Screen>
      <Header title="Profile" left={<RoundBtn icon="arrow-back" onPress={() => navigation.navigate('Shop')} />} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.avatarRing}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text></View>
        </Animated.View>
        <Text style={styles.name}>{user.name}</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>🌱 Customer</Text></View>

        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.stats}>
          <Stat icon="heart" n={favorites.length} label="Favourites" color={colors.red} />
          <View style={styles.vline} />
          <Stat icon="cart" n={cartCount} label="In cart" color={colors.oliveDark} />
          <View style={styles.vline} />
          <Stat icon="receipt" n={orders.length} label="Orders" color={colors.green} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.card}>
          <Row icon="mail-outline" label="Email" value={user.email} />
          <Row icon="call-outline" label="Phone" value={user.phone} />
          <Row icon="location-outline" label="Address" value={user.address} />
        </Animated.View>

        <View style={styles.btns}>
          <PrimaryButton label="Edit Profile" icon="create-outline" onPress={() => navigation.navigate('EditProfile')} />
          <PrimaryButton label="Sign Out" icon="log-out-outline" style={{ backgroundColor: colors.red }} onPress={signOut} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarRing: { alignSelf: 'center', width: 118, height: 118, borderRadius: 59, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center', marginTop: 4, ...shadow },
  avatar: { width: 98, height: 98, borderRadius: 49, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 44, fontWeight: '900', color: colors.text },
  name: { textAlign: 'center', fontSize: 24, fontWeight: '900', marginTop: 12, color: colors.text },
  badge: { alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 14, paddingVertical: 5, borderRadius: 14, marginTop: 6 },
  badgeText: { fontWeight: '700', color: colors.oliveDark, fontSize: 12 },
  stats: { flexDirection: 'row', marginHorizontal: 22, marginTop: 20, backgroundColor: colors.card, borderRadius: 22, paddingVertical: 14, ...shadow },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statN: { fontSize: 20, fontWeight: '900', color: colors.text },
  statL: { fontSize: 11, color: colors.muted, fontWeight: '600' },
  vline: { width: 1, backgroundColor: '#E6ECD8' },
  card: { marginHorizontal: 22, marginTop: 16, backgroundColor: colors.card, borderRadius: 22, padding: 16, gap: 16, ...shadow },
  row: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  rowIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#E8F0D5', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, color: colors.muted, fontWeight: '600' },
  value: { fontSize: 15, fontWeight: '700', color: colors.text },
  btns: { marginHorizontal: 22, marginTop: 22, gap: 12 },
});

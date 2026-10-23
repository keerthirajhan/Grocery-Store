import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, RoundBtn } from '../components/Screen';
import ProductImage from '../components/ProductImage';
import Pressy from '../components/Pressy';
import { Bar } from '../components/AdminUI';
import { useToast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import { LOW_STOCK } from '../data/products';
import { colors, shadow } from '../theme';

export default function AdminInventoryScreen({ navigation }) {
  const { products, restock, logWaste, deleteProduct } = useApp();
  const toast = useToast();
  const maxStock = Math.max(...products.map((p) => p.stock), 1);

  return (
    <Screen>
      <Header
        title="Inventory"
        subtitle={`${products.length} products`}
        left={<RoundBtn icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />}
        right={<RoundBtn icon="add" onPress={() => navigation.navigate('AddProduct')} />}
      />
      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
        renderItem={({ item: p, index }) => {
          const low = p.stock <= LOW_STOCK;
          return (
            <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 50).springify().damping(16)} style={styles.row}>
              <View style={styles.thumb}><ProductImage item={p} style={{ height: '100%' }} emojiSize={26} /></View>
              <View style={{ flex: 1 }}>
                <View style={styles.top}>
                  <Text style={styles.name}>{p.name}</Text>
                  <Text style={[styles.qty, low && { color: colors.red }]}>{p.stock} kg</Text>
                </View>
                <Text style={styles.sub}>Rs {p.price}/kg · {p.sold} kg sold · {p.wasted} kg wasted</Text>
                <Bar pct={(p.stock / maxStock) * 100} color={low ? colors.red : colors.olive} height={6} />
                <View style={styles.actions}>
                  <Pressy style={[styles.chip, { backgroundColor: '#E3F2E9' }]} onPress={() => { restock(p.id, 10); toast(`${p.name} restocked +10 kg`); }}>
                    <Ionicons name="add-circle-outline" size={14} color={colors.green} />
                    <Text style={[styles.chipText, { color: colors.green }]}>Restock +10</Text>
                  </Pressy>
                  <Pressy style={[styles.chip, { backgroundColor: '#FDF1DC' }]} onPress={() => { logWaste(p.id, 1); toast(`1 kg ${p.name} logged as waste`, 'error'); }}>
                    <Ionicons name="trash-bin-outline" size={14} color="#B5740F" />
                    <Text style={[styles.chipText, { color: '#B5740F' }]}>Waste −1</Text>
                  </Pressy>
                  <Pressy style={[styles.chip, { backgroundColor: '#FDEDEB' }]} onPress={() => { deleteProduct(p.id); toast(`${p.name} removed`, 'error'); }}>
                    <Ionicons name="close-circle-outline" size={14} color={colors.red} />
                  </Pressy>
                </View>
              </View>
            </Animated.View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, backgroundColor: colors.card, borderRadius: 22, padding: 12, marginBottom: 12, ...shadow },
  thumb: { width: 64, height: 64, borderRadius: 18, overflow: 'hidden' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontWeight: '900', fontSize: 16, color: colors.text },
  qty: { fontWeight: '900', fontSize: 14, color: colors.olive },
  sub: { fontSize: 11, color: colors.muted, fontWeight: '600', marginVertical: 4 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  chipText: { fontSize: 11, fontWeight: '800' },
});

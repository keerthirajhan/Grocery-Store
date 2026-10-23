import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, RoundBtn } from '../components/Screen';
import ProductImage from '../components/ProductImage';
import { Bar, Card, Kpi, SectionTitle, money } from '../components/AdminUI';
import { useApp } from '../context/AppContext';
import { LOW_STOCK } from '../data/products';
import { colors } from '../theme';

function SellerCard({ title, icon, tone, item }) {
  if (!item) return null;
  return (
    <Card style={styles.seller} delay={200}>
      <View style={styles.sellerHead}>
        <Ionicons name={icon} size={16} color={tone} />
        <Text style={[styles.sellerTitle, { color: tone }]}>{title}</Text>
      </View>
      <View style={styles.sellerPhoto}><ProductImage item={item} style={{ height: '100%' }} emojiSize={40} /></View>
      <Text style={styles.sellerName}>{item.name}</Text>
      <Text style={styles.sellerSub}>{item.sold.toLocaleString('en-IN')} kg sold</Text>
      <Text style={styles.sellerSub}>{money(item.sold * item.price)} revenue</Text>
    </Card>
  );
}

export default function AdminDashboardScreen({ navigation }) {
  const { user, products, stats } = useApp();
  const maxStock = Math.max(...products.map((p) => p.stock), 1);
  const alerts = [...stats.out, ...stats.low];

  return (
    <Screen>
      <Header
        big
        subtitle={`Hello, ${user.name.split(' ')[0]} · Admin`}
        title={'Daily\nGrocery Food'}
        left={<RoundBtn icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />}
        right={<RoundBtn icon="notifications-outline" onPress={() => navigation.navigate('Inventory')} />}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.kpis}>
          <Kpi icon="cube-outline" label="Total stock" value={`${stats.totalStock.toLocaleString('en-IN')} kg`} delay={50} />
          <Kpi icon="cash-outline" label="Stock value" value={money(stats.stockValue)} tone="#2A7DB5" delay={120} />
          <Kpi icon="warning-outline" label="Low / out" value={`${stats.low.length} / ${stats.out.length}`} tone={colors.red} delay={190} />
        </View>

        <Card delay={120} style={{ marginTop: 14 }}>
          <SectionTitle title="Low stock alerts" hint={`≤ ${LOW_STOCK} kg`} />
          {alerts.length === 0 ? (
            <View style={styles.okRow}>
              <Ionicons name="checkmark-circle" size={22} color={colors.green} />
              <Text style={styles.okText}>All products are well stocked</Text>
            </View>
          ) : (
            alerts.map((p) => (
              <View key={p.id} style={styles.row}>
                <View style={styles.thumb}><ProductImage item={p} style={{ height: '100%' }} emojiSize={22} /></View>
                <View style={{ flex: 1 }}>
                  <View style={styles.rowTop}>
                    <Text style={styles.name}>{p.name}</Text>
                    <View style={[styles.tag, { backgroundColor: p.stock === 0 ? colors.red : colors.accent }]}>
                      <Text style={styles.tagText}>{p.stock === 0 ? 'OUT OF STOCK' : `${p.stock} kg left`}</Text>
                    </View>
                  </View>
                  <Bar pct={(p.stock / LOW_STOCK) * 100} color={p.stock === 0 ? colors.red : colors.accent} />
                </View>
              </View>
            ))
          )}
        </Card>

        <View style={styles.sellers}>
          <SellerCard title="Most selling" icon="trophy-outline" tone={colors.green} item={stats.best} />
          <SellerCard title="Least selling" icon="trending-down-outline" tone={colors.red} item={stats.least} />
        </View>

        <Card delay={260}>
          <SectionTitle title="Overall stock available" hint={`${products.length} products`} />
          {[...products].sort((a, b) => b.stock - a.stock).map((p, i) => {
            const low = p.stock <= LOW_STOCK;
            return (
              <View key={p.id} style={styles.stockRow}>
                <Text style={styles.stockName} numberOfLines={1}>{p.name}</Text>
                <Bar pct={(p.stock / maxStock) * 100} color={low ? colors.red : colors.olive} delay={i * 40} />
                <Text style={[styles.stockQty, low && { color: colors.red }]}>{p.stock} kg</Text>
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kpis: { flexDirection: 'row', gap: 10, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  thumb: { width: 44, height: 44, borderRadius: 14, overflow: 'hidden' },
  rowTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  name: { fontWeight: '800', color: colors.text, fontSize: 14 },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  okRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  okText: { color: colors.green, fontWeight: '700' },
  sellers: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  seller: { flex: 1, marginHorizontal: 0, alignItems: 'center' },
  sellerHead: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 10 },
  sellerTitle: { fontWeight: '800', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },
  sellerPhoto: { width: 84, height: 84, borderRadius: 42, overflow: 'hidden', marginBottom: 8, borderWidth: 3, borderColor: '#EEF4F0' },
  sellerName: { fontWeight: '900', fontSize: 16, color: colors.text },
  sellerSub: { fontSize: 12, color: colors.muted, fontWeight: '600', marginTop: 1 },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  stockName: { width: 78, fontSize: 13, fontWeight: '700', color: colors.text },
  stockQty: { width: 54, textAlign: 'right', fontSize: 12, fontWeight: '800', color: colors.muted },
});

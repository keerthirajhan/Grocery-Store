import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, RoundBtn } from '../components/Screen';
import { Bar, Card, Kpi, SectionTitle, money } from '../components/AdminUI';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

const lastMonthLabel = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
};

export default function AdminReportsScreen({ navigation }) {
  const { products, stats } = useApp();

  const byRevenue = [...products].filter((p) => p.lastMonth > 0).sort((a, b) => b.lastMonth * b.price - a.lastMonth * a.price);
  const topRev = byRevenue.slice(0, 6);
  const maxRev = topRev[0] ? topRev[0].lastMonth * topRev[0].price : 1;

  const fruitRev = products.filter((p) => p.category === 'Fruits').reduce((s, p) => s + p.lastMonth * p.price, 0);
  const vegRev = stats.lmRevenue - fruitRev;
  const fruitPct = stats.lmRevenue ? (fruitRev / stats.lmRevenue) * 100 : 0;

  const byWaste = [...products].filter((p) => p.wasted > 0).sort((a, b) => b.wasted - a.wasted);
  const topWaste = byWaste.slice(0, 6);
  const maxWaste = topWaste[0]?.wasted || 1;

  return (
    <Screen>
      <Header
        title="Reports"
        subtitle="Sales & wastage"
        left={<RoundBtn icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <Card>
          <SectionTitle title="Last month sales report" hint={lastMonthLabel()} />
          <View style={styles.kpis}>
            <Kpi icon="cash-outline" label="Revenue" value={money(stats.lmRevenue)} delay={60} />
            <Kpi icon="scale-outline" label="Sold" value={`${stats.lmUnits.toLocaleString('en-IN')} kg`} tone="#2A7DB5" delay={120} />
          </View>
          <View style={[styles.kpis, { marginTop: 10 }]}>
            <Kpi icon="receipt-outline" label="Orders" value={String(stats.lmOrders)} tone="#8A5CC2" delay={180} />
            <Kpi icon="pricetag-outline" label="Avg. order" value={money(stats.lmAvg)} tone={colors.accent} delay={240} />
          </View>

          <Text style={styles.sub}>Top products by revenue</Text>
          {topRev.map((p, i) => (
            <View key={p.id} style={styles.barRow}>
              <Text style={styles.barName} numberOfLines={1}>{p.name}</Text>
              <Bar pct={((p.lastMonth * p.price) / maxRev) * 100} delay={i * 60} height={10} />
              <Text style={styles.barVal}>{money(p.lastMonth * p.price)}</Text>
            </View>
          ))}

          <Text style={styles.sub}>Revenue by category</Text>
          <View style={styles.split}>
            <View style={{ flex: fruitPct || 1, backgroundColor: colors.olive }} />
            <View style={{ flex: 100 - fruitPct || 1, backgroundColor: colors.accent }} />
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: colors.olive }]} /><Text style={styles.legendText}>Fruits {money(fruitRev)}</Text></View>
            <View style={styles.legendItem}><View style={[styles.dot, { backgroundColor: colors.accent }]} /><Text style={styles.legendText}>Vegetables {money(vegRev)}</Text></View>
          </View>
        </Card>

        <Card delay={120}>
          <SectionTitle title="This month so far" hint="live from orders" />
          <View style={styles.kpis}>
            <Kpi icon="bag-check-outline" label="Orders booked" value={String(stats.monthOrders)} />
            <Kpi icon="trending-up-outline" label="Revenue" value={money(stats.monthRevenue)} tone={colors.green} />
          </View>
        </Card>

        <Card delay={180}>
          <SectionTitle title="Overall wastage" hint="all time" />
          <View style={styles.wasteHero}>
            <View style={styles.wasteIcon}><Ionicons name="trash-outline" size={24} color={colors.red} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.wasteBig}>{stats.wasteKg.toLocaleString('en-IN')} kg</Text>
              <Text style={styles.wasteSub}>worth {money(stats.wasteValue)} · {stats.wastePct.toFixed(1)}% of stock handled</Text>
            </View>
          </View>
          <Text style={styles.sub}>Most wasted products</Text>
          {topWaste.map((p, i) => (
            <View key={p.id} style={styles.barRow}>
              <Text style={styles.barName} numberOfLines={1}>{p.name}</Text>
              <Bar pct={(p.wasted / maxWaste) * 100} color={colors.red} delay={i * 60} height={10} />
              <Text style={styles.barVal}>{p.wasted} kg</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kpis: { flexDirection: 'row', gap: 10 },
  sub: { fontWeight: '800', color: colors.text, marginTop: 18, marginBottom: 10, fontSize: 14 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 9 },
  barName: { width: 76, fontSize: 13, fontWeight: '700', color: colors.text },
  barVal: { width: 70, textAlign: 'right', fontSize: 12, fontWeight: '800', color: colors.muted },
  split: { flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden' },
  legend: { flexDirection: 'row', gap: 16, marginTop: 10, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, fontWeight: '700', color: colors.muted },
  wasteHero: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#FDEDEB', borderRadius: 18, padding: 14 },
  wasteIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  wasteBig: { fontSize: 24, fontWeight: '900', color: colors.red },
  wasteSub: { fontSize: 12, color: colors.muted, fontWeight: '600', marginTop: 2 },
});

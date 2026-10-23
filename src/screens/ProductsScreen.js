import React, { useState } from 'react';
import { DrawerActions } from '@react-navigation/native';
import { FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, RoundBtn } from '../components/Screen';
import ProductCard from '../components/ProductCard';
import Floating from '../components/Floating';
import Pressy from '../components/Pressy';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/products';
import { colors, shadow } from '../theme';

const CAT_IMG = {
  Fruits: require('../../assets/products/banana.jpg'),
  Vegetables: require('../../assets/products/tomato.jpg'),
};
const SORTS = [
  { key: 'default', label: 'Popular' },
  { key: 'low', label: 'Price: low to high' },
  { key: 'high', label: 'Price: high to low' },
];

export default function ProductsScreen({ navigation }) {
  const { products, user } = useApp();
  const [category, setCategory] = useState('Fruits');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(0);

  let list = products.filter(
    (p) => p.category === category && p.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  const key = SORTS[sort].key;
  if (key === 'low') list = [...list].sort((a, b) => a.price - b.price);
  else if (key === 'high') list = [...list].sort((a, b) => b.price - a.price);
  else list = [...list].sort((a, b) => b.sold - a.sold);

  const listHeader = (
    <View>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            style={styles.search}
            placeholder="Search fresh products..."
            placeholderTextColor="#9AA48C"
            value={query}
            onChangeText={setQuery}
          />
          {query ? <Ionicons name="close-circle" size={18} color={colors.grey} onPress={() => setQuery('')} /> : null}
        </View>
        <Pressy style={styles.filter} onPress={() => setSort((sort + 1) % SORTS.length)}>
          <Ionicons name="options-outline" size={20} color="#fff" />
        </Pressy>
      </View>
      <Text style={styles.sortText}>Sorted by: {SORTS[sort].label} (tap the filter to change)</Text>

      <Animated.View entering={FadeInDown.delay(100).springify().damping(15)}>
        <LinearGradient colors={['#E4EEC6', '#CFE0A0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bTag}>FRESH DEALS</Text>
            <Text style={styles.bTitle}>Up to 20% off{'\n'}seasonal produce</Text>
            <View style={styles.bBtn}><Text style={styles.bBtnText}>Free delivery above Rs 200</Text></View>
          </View>
          <View style={styles.bPhotos}>
            <Floating amount={7} duration={1700} style={[styles.bCircle, { top: 0, right: 34 }]}>
              <Image source={require('../../assets/products/orange.jpg')} style={styles.bImg} />
            </Floating>
            <Floating amount={9} duration={2100} delay={400} style={[styles.bCircle, styles.bCircleSm, { bottom: 0, right: 0 }]}>
              <Image source={require('../../assets/products/apple.jpg')} style={styles.bImg} />
            </Floating>
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={styles.catHead}>
        <Text style={styles.catTitle}>Categories</Text>
        <Text style={styles.catCount}>{list.length} items</Text>
      </View>
      <View style={styles.chips}>
        {CATEGORIES.map((c) => {
          const on = category === c;
          return (
            <Pressy key={c} style={[styles.chip, on && styles.chipOn]} onPress={() => setCategory(c)}>
              <Image source={CAT_IMG[c]} style={styles.chipImg} />
              <Text style={[styles.chipText, on && { color: '#fff' }]}>{c}</Text>
            </Pressy>
          );
        })}
      </View>
      <Text style={styles.found}>Found more {category.toLowerCase()} !</Text>
    </View>
  );

  return (
    <Screen>
      <Header
        big
        subtitle={`Hello, ${user.name.split(' ')[0]} 👋`}
        title={'Daily\nGrocery Food'}
        left={<RoundBtn icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />}
        right={
          <Pressy style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
          </Pressy>
        }
      />
      <FlatList
        data={list}
        keyExtractor={(i) => i.id}
        numColumns={2}
        key={category}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={listHeader}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 110 }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={{ fontSize: 50 }}>🔍</Text>
            <Text style={styles.empty}>No products found</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <ProductCard item={item} index={index} onPress={() => navigation.navigate('Details', { id: item.id })} />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 8, marginTop: 4 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 18, paddingHorizontal: 14, height: 48, ...shadow },
  search: { flex: 1, color: colors.text, fontSize: 14, outlineStyle: 'none' },
  filter: { width: 48, height: 48, borderRadius: 18, backgroundColor: colors.olive, alignItems: 'center', justifyContent: 'center', ...shadow },
  sortText: { marginHorizontal: 12, marginTop: 8, marginBottom: 10, fontSize: 12, color: colors.muted, fontWeight: '600' },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.olive, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff', ...shadow },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  banner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, borderRadius: 24, padding: 18, overflow: 'hidden', ...shadow },
  bTag: { color: colors.oliveDark, fontWeight: '800', fontSize: 11, letterSpacing: 1.5 },
  bTitle: { color: colors.text, fontWeight: '900', fontSize: 20, lineHeight: 25, marginVertical: 6 },
  bBtn: { alignSelf: 'flex-start', backgroundColor: colors.olive, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  bBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  bPhotos: { width: 120, height: 100 },
  bCircle: { position: 'absolute', width: 78, height: 78, borderRadius: 39, overflow: 'hidden', borderWidth: 3, borderColor: '#fff' },
  bCircleSm: { width: 62, height: 62, borderRadius: 31 },
  bImg: { width: '100%', height: '100%' },
  catHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 12, marginTop: 18, marginBottom: 10 },
  catTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  catCount: { fontSize: 12, fontWeight: '700', color: colors.olive },
  chips: { flexDirection: 'row', gap: 10, paddingHorizontal: 8, marginBottom: 12 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', paddingLeft: 6, paddingRight: 16, paddingVertical: 6, borderRadius: 26, ...shadow },
  chipOn: { backgroundColor: colors.olive },
  chipImg: { width: 34, height: 34, borderRadius: 17 },
  chipText: { fontWeight: '800', color: colors.text, fontSize: 14 },
  found: { marginHorizontal: 12, marginBottom: 4, fontWeight: '800', fontSize: 16, color: colors.text },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  empty: { textAlign: 'center', marginTop: 8, color: colors.muted, fontWeight: '600' },
});

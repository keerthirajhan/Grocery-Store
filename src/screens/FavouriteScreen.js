import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Screen, Header, RoundBtn, PrimaryButton } from '../components/Screen';
import ProductCard from '../components/ProductCard';
import Floating from '../components/Floating';
import { useToast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import { colors, shadow } from '../theme';

export default function FavouriteScreen({ navigation }) {
  const { products, favorites, addManyToCart, toggleFavorite } = useApp();
  const toast = useToast();
  const [menu, setMenu] = useState(false);
  const list = products.filter((p) => favorites.includes(p.id));

  const addAll = () => {
    setMenu(false);
    if (!list.length) return toast('Add some favourites first', 'error');
    const { added, skipped } = addManyToCart(list.map((p) => p.id));
    if (!added) return toast('Selected items are out of stock', 'error');
    toast(skipped ? `${added} added, ${skipped} out of stock` : `${added} favourite item(s) added to cart`);
  };
  const clearAll = () => {
    setMenu(false);
    list.forEach((p) => toggleFavorite(p.id));
  };

  return (
    <Screen>
      <Header
        title="Favourite"
        subtitle={`${list.length} saved item${list.length === 1 ? '' : 's'}`}
        left={<RoundBtn icon="arrow-back" onPress={() => navigation.navigate('Shop')} />}
        right={<RoundBtn icon="ellipsis-vertical" onPress={() => setMenu(!menu)} />}
      />
      {menu && (
        <Animated.View entering={FadeIn.duration(150)} style={styles.menu}>
          <TouchableOpacity onPress={addAll}><Text style={styles.menuItem}>🛒  Add all to cart</Text></TouchableOpacity>
          <TouchableOpacity onPress={clearAll}><Text style={styles.menuItem}>💔  Clear favourites</Text></TouchableOpacity>
        </Animated.View>
      )}
      <FlatList
        data={list}
        keyExtractor={(i) => i.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 110, flexGrow: 1 }}
        ListEmptyComponent={
          <Animated.View entering={FadeInDown.springify()} style={styles.emptyBox}>
            <Floating amount={8}><Text style={{ fontSize: 80 }}>💚</Text></Floating>
            <Text style={styles.emptyTitle}>No favourites yet</Text>
            <Text style={styles.empty}>Tap the heart on any product to save it here.</Text>
            <PrimaryButton label="Browse Products" style={{ marginTop: 18, paddingHorizontal: 30 }} onPress={() => navigation.navigate('Shop')} />
          </Animated.View>
        }
        renderItem={({ item, index }) => (
          <ProductCard item={item} index={index} onPress={() => navigation.navigate('Details', { id: item.id })} />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  menu: { position: 'absolute', top: 100, right: 18, zIndex: 10, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 6, ...shadow },
  menuItem: { paddingVertical: 11, paddingHorizontal: 14, fontWeight: '700', color: colors.text },
  emptyBox: { alignItems: 'center', marginTop: 70, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 10 },
  empty: { textAlign: 'center', marginTop: 6, color: colors.muted },
});

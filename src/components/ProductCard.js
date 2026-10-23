import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, ratingFor, shadow } from '../theme';
import ProductImage from './ProductImage';
import { useApp } from '../context/AppContext';
import { useToast } from './Toast';
import Pressy from './Pressy';
import { LOW_STOCK } from '../data/products';

export default function ProductCard({ item, index = 0, onPress }) {
  const { user, favorites, toggleFavorite, addToCart, deleteProduct } = useApp();
  const toast = useToast();
  const isAdmin = user?.role === 'admin';
  const fav = favorites.includes(item.id);

  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 70).springify().damping(14)} style={styles.wrap}>
      <Pressy style={styles.card} onPress={onPress} scaleTo={0.97}>
        <View style={styles.photo}>
          <ProductImage item={item} style={styles.photoImg} />
          {item.stock <= LOW_STOCK && (
            <View style={[styles.stockTag, { backgroundColor: item.stock === 0 ? colors.red : colors.accent }]}>
              <Text style={styles.stockText}>{item.stock === 0 ? 'Out of stock' : `Only ${item.stock}kg left`}</Text>
            </View>
          )}
        </View>

        {isAdmin ? (
          <Pressy style={styles.corner} onPress={() => { deleteProduct(item.id); toast(`${item.name} removed`, 'error'); }}>
            <Ionicons name="trash-outline" size={16} color={colors.red} />
          </Pressy>
        ) : (
          <Pressy style={styles.corner} onPress={() => toggleFavorite(item.id)}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={17} color={colors.red} />
          </Pressy>
        )}

        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <View style={styles.rating}>
          <Ionicons name="star" size={11} color="#F2B90F" />
          <Text style={styles.ratingText}>{ratingFor(item.name)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.price}>Rs {item.price}<Text style={styles.unit}>/kg</Text></Text>
          <Pressy
            style={styles.add}
            onPress={() => {
              const r = addToCart(item.id);
              if (r.ok) toast(`${item.name} added to cart`);
              else toast(r.left ? `Only ${r.left}kg more of ${item.name} available` : `${item.name} is out of stock`, 'error');
            }}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </Pressy>
        </View>
      </Pressy>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, margin: 7 },
  card: { backgroundColor: colors.card, borderRadius: 22, padding: 10, ...shadow },
  photo: { borderRadius: 18, overflow: 'hidden', marginBottom: 10, backgroundColor: '#fff', aspectRatio: 1.1 },
  photoImg: { height: '100%' },
  stockTag: { position: 'absolute', left: 8, bottom: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  stockText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  corner: {
    position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center',
  },
  name: { fontSize: 15, fontWeight: '800', color: colors.text, paddingHorizontal: 4 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 4, marginTop: 2 },
  ratingText: { fontSize: 11, color: colors.muted, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingLeft: 4 },
  price: { fontSize: 15, fontWeight: '800', color: colors.text },
  unit: { fontSize: 11, fontWeight: '500', color: colors.muted },
  add: { width: 32, height: 32, borderRadius: 11, backgroundColor: colors.olive, alignItems: 'center', justifyContent: 'center' },
});

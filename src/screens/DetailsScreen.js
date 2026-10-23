import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, RoundBtn } from '../components/Screen';
import Floating from '../components/Floating';
import Pressy from '../components/Pressy';
import { useToast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import { colors, ratingFor, shadow, tintFor } from '../theme';
import ProductImage from '../components/ProductImage';

export default function DetailsScreen({ navigation, route }) {
  const { products, favorites, toggleFavorite, addToCart } = useApp();
  const toast = useToast();
  const product = products.find((p) => p.id === route.params.id);
  const [qty, setQty] = useState(1);
  if (!product) return null;
  const fav = favorites.includes(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const add = () => {
    const r = addToCart(product.id, qty);
    if (!r.ok) return toast(r.left ? `Only ${r.left}kg more available` : `${product.name} is out of stock`, 'error');
    toast(`${qty}kg ${product.name} added to cart`);
    setQty(1);
  };

  return (
    <Screen>
      <Header
        title="Details"
        left={<RoundBtn icon="arrow-back" onPress={() => navigation.goBack()} />}
        right={<RoundBtn icon={fav ? 'heart' : 'heart-outline'} color={colors.red} onPress={() => toggleFavorite(product.id)} />}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.heroBox}>
          <Animated.View entering={ZoomIn.duration(600)} style={[styles.blob, { backgroundColor: tintFor(product.name) }]} />
          <Animated.View entering={ZoomIn.delay(150).duration(600)} style={styles.blobInner} />
          <Floating amount={8} duration={1900}>
            <Animated.View key={product.id} entering={ZoomIn.springify().damping(12)} style={styles.heroPhoto}>
              <ProductImage item={product} style={{ height: '100%' }} emojiSize={100} />
            </Animated.View>
          </Floating>
        </View>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: '#F29B2C' }]} />
          <View style={[styles.dot, { backgroundColor: colors.olive, width: 22 }]} />
          <View style={[styles.dot, { backgroundColor: '#F29B2C' }]} />
        </View>

        <Animated.View entering={FadeInUp.delay(100).springify().damping(16)} style={styles.sheet}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>Fresh {product.name}</Text>
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((i) => <Ionicons key={i} name="star" size={15} color="#F2B90F" />)}
                <Text style={styles.rate}>{ratingFor(product.name)} (120 reviews)</Text>
              </View>
            </View>
            <View style={styles.stepper}>
              <Pressy style={styles.stepBtn} onPress={() => setQty(Math.max(1, qty - 1))}>
                <Ionicons name="remove" size={16} color={colors.text} />
              </Pressy>
              <Text style={styles.qty}>{qty}kg</Text>
              <Pressy style={styles.stepBtn} onPress={() => setQty(qty + 1)}>
                <Ionicons name="add" size={16} color={colors.text} />
              </Pressy>
            </View>
          </View>

          <View style={styles.tags}>
            {[['leaf-outline', 'Organic'], ['flash-outline', 'Fast delivery'], ['cube-outline', product.stock ? `${product.stock}kg in stock` : 'Out of stock']].map(([ic, t]) => (
              <View key={t} style={styles.tag}>
                <Ionicons name={ic} size={13} color={colors.oliveDark} />
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.section}>Description</Text>
          <Text style={styles.desc}>{product.description}</Text>

          <Text style={styles.section}>Related Items</Text>
          <View style={styles.related}>
            {related.map((r, i) => (
              <Animated.View key={r.id} entering={FadeInDown.delay(250 + i * 80).springify()}>
                <Pressy style={[styles.relCard, { backgroundColor: tintFor(r.name) }]} onPress={() => navigation.push('Details', { id: r.id })}>
                  <ProductImage item={r} style={{ height: '100%' }} emojiSize={30} />
                </Pressy>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>Rs {product.price * qty}<Text style={styles.priceUnit}>/{qty}kg</Text></Text>
        </View>
        <Pressy style={styles.addBtn} onPress={add}>
          <Ionicons name="cart" size={18} color="#fff" />
          <Text style={styles.addText}>Add to Cart</Text>
        </Pressy>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroBox: { height: 230, alignItems: 'center', justifyContent: 'center' },
  blob: { position: 'absolute', width: 230, height: 230, borderRadius: 115, opacity: 0.8 },
  blobInner: { position: 'absolute', width: 170, height: 170, borderRadius: 85, backgroundColor: 'rgba(255,255,255,0.55)' },
  heroPhoto: { width: 190, height: 190, borderRadius: 95, overflow: 'hidden', borderWidth: 6, borderColor: '#fff', ...shadow },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginVertical: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  sheet: { marginHorizontal: 14, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 28, padding: 20, ...shadow },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 22, fontWeight: '900', color: colors.text },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  rate: { marginLeft: 6, fontSize: 12, color: colors.muted, fontWeight: '600' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 4 },
  stepBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  qty: { fontWeight: '800', fontSize: 14, minWidth: 34, textAlign: 'center' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#E8F0D5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  tagText: { fontSize: 12, fontWeight: '700', color: colors.oliveDark },
  section: { fontSize: 17, fontWeight: '800', marginTop: 18, marginBottom: 6, color: colors.text },
  desc: { fontSize: 13, color: colors.muted, lineHeight: 20 },
  related: { flexDirection: 'row', gap: 12 },
  relCard: { width: 64, height: 64, borderRadius: 18, overflow: 'hidden', borderWidth: 2, borderColor: '#fff', ...shadow },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingVertical: 14, backgroundColor: colors.tab, borderTopLeftRadius: 28, borderTopRightRadius: 28, ...shadow },
  priceLabel: { fontSize: 11, color: '#76806A', fontWeight: '600' },
  price: { fontSize: 22, fontWeight: '900', color: colors.text },
  priceUnit: { fontSize: 13, fontWeight: '600' },
  addBtn: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: colors.olive, borderRadius: 24, paddingHorizontal: 26, paddingVertical: 14, ...shadow },
  addText: { color: '#fff', fontWeight: '800', fontSize: 15 },
});

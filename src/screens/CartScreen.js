import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, LinearTransition, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, RoundBtn, PrimaryButton } from '../components/Screen';
import Floating from '../components/Floating';
import Pressy from '../components/Pressy';
import { useToast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import { colors, shadow } from '../theme';
import ProductImage from '../components/ProductImage';

const FREE_AT = 200;
const DELIVERY = 30;

export default function CartScreen({ navigation }) {
  const { cartItems, total, changeQty, clearCart, placeOrder } = useApp();
  const toast = useToast();
  const [order, setOrder] = useState(null);

  const delivery = cartItems.length && total < FREE_AT ? DELIVERY : 0;
  const grand = total + delivery;

  const book = () => {
    if (!cartItems.length) return toast('Your cart is empty', 'error');
    setOrder(placeOrder(grand));
  };

  return (
    <Screen>
      <Header
        title="My Cart"
        subtitle={`${cartItems.length} item${cartItems.length === 1 ? '' : 's'}`}
        left={<RoundBtn icon="arrow-back" onPress={() => navigation.navigate('Shop')} />}
        right={cartItems.length ? <RoundBtn icon="trash-outline" color={colors.red} onPress={clearCart} /> : null}
      />
      <FlatList
        data={cartItems}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        itemLayoutAnimation={LinearTransition}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 10, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Floating amount={8}><Text style={{ fontSize: 80 }}>🛒</Text></Floating>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.empty}>Fresh fruits and vegetables are waiting for you.</Text>
            <PrimaryButton label="Start Shopping" style={{ marginTop: 18, paddingHorizontal: 30 }} onPress={() => navigation.navigate('Shop')} />
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(index * 60).springify().damping(15)} exiting={FadeOutLeft} layout={LinearTransition} style={styles.row}>
            <View style={styles.thumb}>
              <ProductImage item={item} style={{ height: '100%' }} emojiSize={36} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>Fresh {item.category === 'Fruits' ? 'fruits' : 'vegetable'}</Text>
              <Text style={styles.price}>Rs {item.price}/kg</Text>
            </View>
            <View style={styles.stepper}>
              <Pressy
                style={[styles.stepBtn, { backgroundColor: colors.yellow }]}
                onPress={() => { if (!changeQty(item.id, 1)) toast(`Only ${item.stock}kg of ${item.name} in stock`, 'error'); }}
              >
                <Ionicons name="add" size={16} color={colors.text} />
              </Pressy>
              <Text style={styles.qty}>{item.qty}</Text>
              <Pressy style={styles.stepBtn} onPress={() => changeQty(item.id, -1)}>
                <Ionicons name={item.qty === 1 ? 'trash-outline' : 'remove'} size={15} color={item.qty === 1 ? colors.red : colors.text} />
              </Pressy>
            </View>
          </Animated.View>
        )}
      />

      {cartItems.length > 0 && (
        <Animated.View entering={ZoomIn.springify().damping(15)} style={styles.footer}>
          <View style={styles.line}><Text style={styles.lineLabel}>Subtotal</Text><Text style={styles.lineVal}>Rs {total}.00</Text></View>
          <View style={styles.line}>
            <Text style={styles.lineLabel}>Delivery</Text>
            <Text style={[styles.lineVal, !delivery && { color: colors.green }]}>{delivery ? `Rs ${delivery}.00` : 'FREE'}</Text>
          </View>
          {delivery > 0 && <Text style={styles.nudge}>Add Rs {FREE_AT - total} more for free delivery 🚚</Text>}
          <View style={styles.divider} />
          <View style={styles.line}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalLabel}>Rs {grand}.00</Text>
          </View>
          <PrimaryButton label="Book Now" icon="chevron-forward" onPress={book} style={{ marginTop: 12 }} />
        </Animated.View>
      )}

      <Modal transparent visible={!!order} animationType="fade" onRequestClose={() => setOrder(null)}>
        <View style={styles.overlay}>
          {order && (
            <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.modal}>
              <View style={styles.check}><Ionicons name="checkmark" size={46} color="#fff" /></View>
              <Text style={styles.okTitle}>Order Booked!</Text>
              <Text style={styles.okSub}>Thank you for shopping with us. Your fresh groceries are on the way 🚚</Text>
              <View style={styles.receipt}>
                <View style={styles.line}><Text style={styles.lineLabel}>Order ID</Text><Text style={styles.lineVal}>#{order.id}</Text></View>
                <View style={styles.line}><Text style={styles.lineLabel}>Items</Text><Text style={styles.lineVal}>{order.items}</Text></View>
                <View style={styles.line}><Text style={styles.lineLabel}>Amount paid</Text><Text style={styles.lineVal}>Rs {order.amount}.00</Text></View>
              </View>
              <PrimaryButton label="Continue Shopping" style={{ alignSelf: 'stretch' }} onPress={() => { setOrder(null); navigation.navigate('Shop'); }} />
            </Animated.View>
          )}
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: 22, padding: 10, marginBottom: 12, gap: 12, ...shadow },
  thumb: { width: 72, height: 72, borderRadius: 18, overflow: 'hidden' },
  name: { fontSize: 17, fontWeight: '800', color: colors.text },
  sub: { fontSize: 11, color: colors.muted },
  price: { fontSize: 14, fontWeight: '800', marginTop: 3, color: colors.oliveDark },
  stepper: { alignItems: 'center', gap: 4, backgroundColor: '#fff', borderRadius: 16, padding: 4 },
  stepBtn: { width: 28, height: 28, borderRadius: 10, backgroundColor: '#EEF2E3', alignItems: 'center', justifyContent: 'center' },
  qty: { fontSize: 14, fontWeight: '800' },
  emptyBox: { alignItems: 'center', marginTop: 70, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 10 },
  empty: { textAlign: 'center', marginTop: 6, color: colors.muted },
  footer: { marginHorizontal: 14, marginBottom: 92, backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: 26, padding: 18, ...shadow },
  line: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  lineLabel: { color: colors.muted, fontWeight: '600', fontSize: 14 },
  lineVal: { color: colors.text, fontWeight: '800', fontSize: 14 },
  nudge: { fontSize: 12, color: colors.oliveDark, fontWeight: '700', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#E6ECD8', marginVertical: 8 },
  totalLabel: { fontWeight: '900', fontSize: 17, color: colors.text },
  overlay: { flex: 1, backgroundColor: 'rgba(20,30,8,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { width: '100%', maxWidth: 380, backgroundColor: '#FFFFFF', borderRadius: 30, padding: 24, alignItems: 'center' },
  check: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', marginTop: -62, borderWidth: 6, borderColor: '#FFFFFF' },
  okTitle: { fontSize: 24, fontWeight: '900', marginTop: 14, color: colors.text },
  okSub: { textAlign: 'center', color: colors.muted, marginVertical: 10, lineHeight: 20 },
  receipt: { alignSelf: 'stretch', backgroundColor: '#F1F5E6', borderRadius: 18, padding: 14, marginBottom: 18 },
});

import React, { useState } from 'react';
import { DrawerActions } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen, Header, RoundBtn, PrimaryButton } from '../components/Screen';
import Pressy from '../components/Pressy';
import { useToast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/products';
import { colors, shadow } from '../theme';

export default function AddProductScreen({ navigation }) {
  const { addProduct } = useApp();
  const toast = useToast();
  const empty = { name: '', price: '', stock: '', emoji: '', description: '' };
  const [form, setForm] = useState(empty);
  const [category, setCategory] = useState('Fruits');
  const [errors, setErrors] = useState({});
  const set = (k) => (v) => setForm({ ...form, [k]: v });

  const save = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    const price = Number(form.price);
    if (!form.price || isNaN(price) || price <= 0) e.price = 'Enter a valid price greater than 0';
    const stock = Number(form.stock);
    if (!form.stock || isNaN(stock) || stock < 0 || !Number.isInteger(stock)) e.stock = 'Enter opening stock as a whole number (kg)';
    if (!form.emoji.trim()) e.emoji = 'Enter an emoji to represent the product';
    if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters';
    setErrors(e);
    if (Object.keys(e).length) return toast('Please fix the highlighted fields', 'error');
    addProduct({ name: form.name.trim(), price, stock, emoji: form.emoji.trim(), category, description: form.description.trim() });
    toast(`${form.name.trim()} added to ${category}`);
    setForm(empty);
    navigation.navigate('Tabs');
  };

  const field = (key, label, extra = {}) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, errors[key] && styles.inputErr]} value={form[key]} onChangeText={set(key)} {...extra} />
      {errors[key] ? <Text style={styles.err}>{errors[key]}</Text> : null}
    </View>
  );

  return (
    <Screen>
      <Header title="Add Product" subtitle="Admin panel" left={<RoundBtn icon="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />} />
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.springify().damping(15)} style={styles.card}>
          {field('name', 'Product name')}
          {field('price', 'Price per kg (Rs)', { keyboardType: 'numeric' })}
          {field('stock', 'Opening stock (kg)', { keyboardType: 'numeric' })}
          {field('emoji', 'Icon (emoji)', { maxLength: 4 })}
          <Text style={styles.label}>Category</Text>
          <View style={styles.chips}>
            {CATEGORIES.map((c) => (
              <Pressy key={c} style={[styles.chip, category === c && styles.chipOn]} onPress={() => setCategory(c)}>
                <Text style={[styles.chipText, category === c && { color: colors.text }]}>{c}</Text>
              </Pressy>
            ))}
          </View>
          {field('description', 'Description', { multiline: true })}
          <PrimaryButton label="Add Product" icon="add-circle-outline" onPress={save} />
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'rgba(255,255,255,0.78)', borderRadius: 28, padding: 18, ...shadow },
  label: { fontWeight: '700', marginBottom: 6, color: colors.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, borderWidth: 1.5, borderColor: '#E1E8CF', color: colors.text, outlineStyle: 'none' },
  inputErr: { borderColor: colors.red, backgroundColor: '#FFF4F2' },
  err: { color: colors.red, fontSize: 12, marginTop: 4, marginLeft: 6 },
  chips: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  chip: { backgroundColor: '#E6EDD6', paddingHorizontal: 20, paddingVertical: 9, borderRadius: 20 },
  chipOn: { backgroundColor: colors.yellow },
  chipText: { fontWeight: '800', color: colors.muted },
});

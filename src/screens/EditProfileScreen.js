import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen, Header, RoundBtn, PrimaryButton } from '../components/Screen';
import { useToast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import { colors, shadow } from '../theme';
import { isPhone } from '../utils';

export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useApp();
  const toast = useToast();
  const [form, setForm] = useState({ name: user.name, phone: user.phone, address: user.address });
  const [errors, setErrors] = useState({});
  const set = (k) => (v) => setForm({ ...form, [k]: v });

  const save = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!isPhone(form.phone.trim())) e.phone = 'Enter a valid 10-digit mobile number';
    if (form.address.trim().length < 5) e.address = 'Address must be at least 5 characters';
    setErrors(e);
    if (Object.keys(e).length) return toast('Please fix the highlighted fields', 'error');
    updateProfile({ name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim() });
    toast('Profile updated successfully');
    navigation.goBack();
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
      <Header title="Edit Profile" left={<RoundBtn icon="arrow-back" onPress={() => navigation.goBack()} />} />
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.springify().damping(15)} style={styles.card}>
          {field('name', 'Full name')}
          <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>Email (cannot be changed)</Text>
            <TextInput style={[styles.input, { opacity: 0.55 }]} value={user.email} editable={false} />
          </View>
          {field('phone', 'Phone', { keyboardType: 'phone-pad', maxLength: 10 })}
          {field('address', 'Address', { multiline: true })}
          <PrimaryButton label="Save Changes" icon="checkmark" onPress={save} />
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
});

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, RoundBtn, PrimaryButton } from '../components/Screen';
import Floating from '../components/Floating';
import Pressy from '../components/Pressy';
import { useApp } from '../context/AppContext';
import { colors, shadow } from '../theme';
import { isEmail } from '../utils';

export default function AuthScreen({ navigation, route }) {
  const { signIn, signUp } = useApp();
  const [mode, setMode] = useState(route.params?.mode || 'signin');
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const set = (k) => (v) => {
    setForm({ ...form, [k]: v });
    setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const isUp = mode === 'signup';

  const validate = () => {
    const e = {};
    if (isUp && form.name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!isEmail(form.email.trim())) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (isUp && form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    setFormError('');
    if (!validate()) return;
    const email = form.email.trim();
    const err = isUp
      ? signUp({ name: form.name.trim(), email, password: form.password, role })
      : signIn({ email, password: form.password, role });
    if (err) setFormError(err);
  };

  const field = (key, placeholder, icon, extra = {}) => (
    <View style={styles.fieldWrap}>
      <View style={[styles.field, errors[key] && styles.fieldErr]}>
        <Ionicons name={icon} size={18} color={errors[key] ? colors.red : colors.olive} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A5A5A5"
          value={form[key]}
          onChangeText={set(key)}
          autoCapitalize="none"
          {...extra}
        />
        {extra.secureTextEntry !== undefined && key === 'password' ? (
          <TouchableOpacity onPress={() => setShowPw(!showPw)}>
            <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>
      {errors[key] ? <Text style={styles.err}>{errors[key]}</Text> : null}
    </View>
  );

  return (
    <Screen>
      <Header title={isUp ? 'Create Account' : 'Welcome Back'} subtitle="Grocery Shop" left={<RoundBtn icon="arrow-back" onPress={() => navigation.goBack()} />} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Floating amount={8} style={{ alignSelf: 'center' }}><Text style={styles.logo}>🍍</Text></Floating>

          <Animated.View entering={FadeInDown.springify().damping(15)} style={styles.card}>
            <View style={styles.segment}>
              {['signin', 'signup'].map((m) => (
                <TouchableOpacity key={m} style={[styles.segBtn, mode === m && styles.segOn]} onPress={() => { setMode(m); setErrors({}); setFormError(''); }}>
                  <Text style={[styles.segText, mode === m && { color: '#fff' }]}>{m === 'signin' ? 'Sign In' : 'Sign Up'}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Continue as</Text>
            <View style={styles.roles}>
              {[['customer', 'person-outline', 'Customer'], ['admin', 'shield-checkmark-outline', 'Admin']].map(([r, ic, lb]) => (
                <Pressy key={r} style={[styles.role, role === r && styles.roleOn]} onPress={() => setRole(r)}>
                  <Ionicons name={ic} size={16} color={colors.text} />
                  <Text style={styles.roleText}>{lb}</Text>
                </Pressy>
              ))}
            </View>

            {isUp && field('name', 'Full name', 'person-outline')}
            {field('email', 'Email address', 'mail-outline', { keyboardType: 'email-address' })}
            {field('password', 'Password', 'lock-closed-outline', { secureTextEntry: !showPw })}
            {isUp && field('confirm', 'Confirm password', 'shield-checkmark-outline', { secureTextEntry: true })}

            {formError ? (
              <View style={styles.banner}>
                <Ionicons name="alert-circle" size={16} color={colors.red} />
                <Text style={styles.bannerText}>{formError}</Text>
              </View>
            ) : null}
            <PrimaryButton label={isUp ? 'Create Account' : 'Sign In'} icon="arrow-forward" onPress={submit} style={{ marginTop: 6 }} />
          </Animated.View>

          {!isUp && (
            <Text style={styles.hint}>
              Demo customer: customer@shop.com / customer123{'\n'}Demo admin: admin@shop.com / admin123
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 20, paddingBottom: 40 },
  logo: { fontSize: 72, marginBottom: 4 },
  card: { backgroundColor: 'rgba(255,255,255,0.78)', borderRadius: 28, padding: 18, ...shadow },
  segment: { flexDirection: 'row', backgroundColor: '#E6EDD6', borderRadius: 18, padding: 4, marginBottom: 16 },
  segBtn: { flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: 'center' },
  segOn: { backgroundColor: colors.olive },
  segText: { fontWeight: '800', color: colors.muted },
  label: { fontWeight: '700', marginBottom: 8, color: colors.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  roles: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  role: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', paddingVertical: 11, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  roleOn: { backgroundColor: colors.yellow, borderColor: colors.olive },
  roleText: { fontWeight: '800', color: colors.text },
  fieldWrap: { marginBottom: 12 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 14, height: 52, borderWidth: 1.5, borderColor: '#E1E8CF' },
  fieldErr: { borderColor: colors.red, backgroundColor: '#FFF4F2' },
  input: { flex: 1, fontSize: 15, color: colors.text, outlineStyle: 'none' },
  err: { color: colors.red, fontSize: 12, marginTop: 4, marginLeft: 6 },
  banner: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: '#FDEDEB', padding: 10, borderRadius: 12, marginBottom: 8 },
  bannerText: { color: colors.red, fontWeight: '600', flex: 1, fontSize: 13 },
  hint: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: 18, lineHeight: 19 },
});

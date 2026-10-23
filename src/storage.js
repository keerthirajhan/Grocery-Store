import AsyncStorage from '@react-native-async-storage/async-storage';

// Thin JSON wrapper around AsyncStorage. Every key is namespaced with "@gs:".
const K = (key) => `@gs:${key}`;

export const KEYS = {
  users: 'users', // all registered accounts (credentials)
  session: 'session', // email of the signed-in user
  products: 'products', // catalogue + stock / sales / wastage
  orders: 'orders', // booked orders
  userData: (email) => `userdata:${email.toLowerCase()}`, // favourites + cart per user
};

export async function load(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(K(key));
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function save(key, value) {
  try {
    await AsyncStorage.setItem(K(key), JSON.stringify(value));
  } catch {
    // storage full / unavailable: the app keeps working in memory
  }
}

export async function remove(key) {
  try {
    await AsyncStorage.removeItem(K(key));
  } catch {}
}

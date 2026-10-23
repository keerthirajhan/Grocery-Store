import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LAST_MONTH_ORDERS, LOW_STOCK, PRODUCTS } from '../data/products';
import { KEYS, load, save } from '../storage';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

const SEED_USERS = [
  { name: 'Shop Admin', email: 'admin@shop.com', password: 'admin123', role: 'admin', phone: '9876543210', address: 'Head Office, Coimbatore' },
  { name: 'Keerthi', email: 'customer@shop.com', password: 'customer123', role: 'customer', phone: '9123456780', address: '12, Green Street, Coimbatore' },
];

const SEED_IMAGES = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.image]));
// Images are bundled assets (not JSON), so they are stripped before saving and re-attached on load.
const stripImages = (list) => list.map(({ image, ...rest }) => rest);
const attachImages = (list) => list.map((p) => ({ ...p, image: SEED_IMAGES[p.id] }));

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState(SEED_USERS);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState({});
  const [dataFor, setDataFor] = useState(null); // email whose favourites/cart are loaded

  // ---- hydrate everything from AsyncStorage on first launch ----
  useEffect(() => {
    (async () => {
      const [u, s, p, o] = await Promise.all([
        load(KEYS.users), load(KEYS.session), load(KEYS.products), load(KEYS.orders, []),
      ]);
      const allUsers = u || SEED_USERS;
      setUsers(allUsers);
      if (p) setProducts(attachImages(p));
      setOrders(o);
      if (s) {
        const found = allUsers.find((x) => x.email.toLowerCase() === s.toLowerCase());
        if (found) setUser(found);
      }
      setReady(true);
    })();
  }, []);

  // ---- persist on change ----
  useEffect(() => { if (ready) save(KEYS.users, users); }, [users, ready]);
  useEffect(() => { if (ready) save(KEYS.products, stripImages(products)); }, [products, ready]);
  useEffect(() => { if (ready) save(KEYS.orders, orders); }, [orders, ready]);
  useEffect(() => { if (ready) save(KEYS.session, user ? user.email : null); }, [user, ready]);

  // favourites + cart are stored per user
  useEffect(() => {
    if (!user) { setFavorites([]); setCart({}); setDataFor(null); return; }
    let live = true;
    load(KEYS.userData(user.email), { favorites: [], cart: {} }).then((d) => {
      if (!live) return;
      setFavorites(d.favorites || []);
      setCart(d.cart || {});
      setDataFor(user.email);
    });
    return () => { live = false; };
  }, [user?.email]);
  useEffect(() => {
    if (user && dataFor === user.email) save(KEYS.userData(user.email), { favorites, cart });
  }, [favorites, cart, dataFor]);

  // ---- auth ----
  const signUp = ({ name, email, password, role }) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return 'An account with this email already exists';
    const u = { name, email, password, role, phone: '', address: '' };
    setUsers([...users, u]);
    setUser(u);
    return null;
  };

  const signIn = ({ email, password, role }) => {
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (!u) return 'Invalid email or password';
    if (u.role !== role) return `This account is not registered as ${role}`;
    setUser(u);
    return null;
  };

  const signOut = () => setUser(null);

  const updateProfile = (data) => {
    const updated = { ...user, ...data };
    setUsers(users.map((u) => (u.email === user.email ? updated : u)));
    setUser(updated);
  };

  // ---- customer: favourites & cart (limited by available stock) ----
  const stockOf = (id) => products.find((p) => p.id === id)?.stock ?? 0;

  const toggleFavorite = (id) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const addToCart = (id, qty = 1) => {
    const cur = cart[id] || 0;
    const left = stockOf(id) - cur;
    if (qty > left) return { ok: false, left: Math.max(left, 0) };
    setCart({ ...cart, [id]: cur + qty });
    return { ok: true };
  };

  const addManyToCart = (ids) => {
    const next = { ...cart };
    let added = 0;
    ids.forEach((id) => {
      if ((next[id] || 0) + 1 <= stockOf(id)) { next[id] = (next[id] || 0) + 1; added++; }
    });
    setCart(next);
    return { added, skipped: ids.length - added };
  };

  const changeQty = (id, delta) => {
    const q = (cart[id] || 0) + delta;
    if (delta > 0 && q > stockOf(id)) return false;
    const n = { ...cart };
    if (q <= 0) delete n[id]; else n[id] = q;
    setCart(n);
    return true;
  };

  const clearCart = () => setCart({});

  const cartItems = useMemo(
    () => products.filter((p) => cart[p.id]).map((p) => ({ ...p, qty: cart[p.id] })),
    [products, cart]
  );
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const total = cartItems.reduce((s, i) => s + i.qty * i.price, 0);

  const placeOrder = (amount) => {
    const order = {
      id: 'GS' + String(1000 + orders.length + 1),
      amount,
      items: cartCount,
      date: new Date().toISOString(),
      by: user.email,
      lines: cartItems.map((i) => ({ id: i.id, qty: i.qty, price: i.price })),
    };
    setProducts((list) =>
      list.map((p) => (cart[p.id] ? { ...p, stock: Math.max(0, p.stock - cart[p.id]), sold: p.sold + cart[p.id] } : p))
    );
    setOrders((o) => [...o, order]);
    setCart({});
    return order;
  };

  // ---- admin: catalogue & stock ----
  const addProduct = (p) =>
    setProducts((list) => [...list, { ...p, id: 'p' + Date.now(), sold: 0, lastMonth: 0, wasted: 0 }]);
  const deleteProduct = (id) => {
    setProducts((list) => list.filter((p) => p.id !== id));
    setCart((c) => { const n = { ...c }; delete n[id]; return n; });
    setFavorites((f) => f.filter((x) => x !== id));
  };
  const restock = (id, kg = 10) =>
    setProducts((list) => list.map((p) => (p.id === id ? { ...p, stock: p.stock + kg } : p)));
  const logWaste = (id, kg = 1) =>
    setProducts((list) =>
      list.map((p) => (p.id === id && p.stock > 0 ? { ...p, stock: Math.max(0, p.stock - kg), wasted: p.wasted + kg } : p))
    );

  // ---- admin: dashboard numbers ----
  const stats = useMemo(() => {
    const totalStock = products.reduce((s, p) => s + p.stock, 0);
    const stockValue = products.reduce((s, p) => s + p.stock * p.price, 0);
    const out = products.filter((p) => p.stock === 0);
    const low = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK).sort((a, b) => a.stock - b.stock);
    const bySold = [...products].sort((a, b) => b.sold - a.sold);
    const lmUnits = products.reduce((s, p) => s + p.lastMonth, 0);
    const lmRevenue = products.reduce((s, p) => s + p.lastMonth * p.price, 0);
    const wasteKg = products.reduce((s, p) => s + p.wasted, 0);
    const wasteValue = products.reduce((s, p) => s + p.wasted * p.price, 0);
    const soldKg = products.reduce((s, p) => s + p.sold, 0);
    const now = new Date();
    const mine = orders.filter((o) => {
      const d = new Date(o.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    return {
      totalStock, stockValue, out, low,
      best: bySold[0], least: bySold[bySold.length - 1],
      lmUnits, lmRevenue, lmOrders: LAST_MONTH_ORDERS, lmAvg: Math.round(lmRevenue / LAST_MONTH_ORDERS),
      wasteKg, wasteValue, wastePct: soldKg ? (wasteKg / (soldKg + wasteKg)) * 100 : 0,
      monthOrders: mine.length, monthRevenue: mine.reduce((s, o) => s + o.amount, 0),
    };
  }, [products, orders]);

  const value = {
    ready, user, products, favorites, cart, cartItems, cartCount, total, orders, stats,
    signUp, signIn, signOut, updateProfile, toggleFavorite,
    addToCart, addManyToCart, changeQty, clearCart, placeOrder,
    addProduct, deleteProduct, restock, logWaste,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

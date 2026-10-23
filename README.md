# Grocery Shop - React Native (Expo)

Model Examination Oct 2026, Mobile App Development using React Native (MCA, RVS College of Arts and Science).

A grocery shopping app with two roles, **Customer** and **Admin**. There is no backend or database: all data (accounts, products, stock, orders, cart, favourites) is stored on the device with **AsyncStorage**.

## Features

**Customer**
- Welcome, Sign In / Sign Up
- Daily Grocery Food list with search, sort, Fruits / Vegetables categories and stock tags
- Product details (quantity in kg, related items), favourites, cart (add / subtract, stock limits), Book Now
- Profile and Edit Profile with validation

**Admin**
- Dashboard: total stock, low-stock alerts, most and least selling product, stock by product
- Reports: last month sales, this month so far, overall wastage
- Inventory: restock, log wastage, remove products; Add Product (drawer)
- No cart (admins do not purchase)

**Navigation (React Navigation):** Stack + Bottom Tabs + Drawer (swipe to open / close).

## Demo logins

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@shop.com | customer123 |
| Admin | admin@shop.com | admin123 |

(Choose the matching Admin / Customer chip on the sign-in screen.)

## Run

```bash
npm install
npx expo start            # scan the QR with Expo Go (same Wi-Fi)
npx expo start --tunnel   # works on any network
npx expo start --web      # in the browser
```

Android APK (Expo EAS):

```bash
npx eas-cli@latest build --platform android --profile preview
```

## Tech

Expo, React Native, React Navigation (native-stack, bottom-tabs, drawer), Reanimated, AsyncStorage.

## Image credits

Product photos are from Wikimedia Commons under open licences. See `assets/products/CREDITS.md`.

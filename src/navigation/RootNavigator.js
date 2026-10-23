import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors } from '../theme';

import WelcomeScreen from '../screens/WelcomeScreen';
import AuthScreen from '../screens/AuthScreen';
import ProductsScreen from '../screens/ProductsScreen';
import FavouriteScreen from '../screens/FavouriteScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import DetailsScreen from '../screens/DetailsScreen';
import AddProductScreen from '../screens/AddProductScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminReportsScreen from '../screens/AdminReportsScreen';
import AdminInventoryScreen from '../screens/AdminInventoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const ICONS = {
  Shop: ['home', 'home-outline', 'Home'],
  Favourite: ['heart', 'heart-outline', 'Favourite'],
  Cart: ['cart', 'cart-outline', 'My Cart'],
  Profile: ['person-circle', 'person-circle-outline', 'Profile'],
  Dashboard: ['grid', 'grid-outline', 'Dashboard'],
  Reports: ['bar-chart', 'bar-chart-outline', 'Reports'],
  Inventory: ['cube', 'cube-outline', 'Inventory'],
};

function Tabs() {
  const { user, cartCount } = useApp();
  const isAdmin = user.role === 'admin';
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.olive,
        tabBarInactiveTintColor: '#8A9477',
        tabBarStyle: {
          position: 'absolute', left: 14, right: 14, bottom: 14, height: 68, borderRadius: 26,
          backgroundColor: colors.tab, borderTopWidth: 0, paddingBottom: 8, paddingTop: 6,
          shadowColor: '#2c3d10', shadowOpacity: 0.2, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 12,
        },
        tabBarItemStyle: { borderRadius: 20 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarLabel: ICONS[route.name][2],
        tabBarIcon: ({ focused, color }) => (
          <View style={{ width: 46, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? '#E8F0D5' : 'transparent' }}>
            <Ionicons name={ICONS[route.name][focused ? 0 : 1]} size={22} color={color} />
          </View>
        ),
      })}
    >
      {isAdmin ? (
        <>
          <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
          <Tab.Screen name="Reports" component={AdminReportsScreen} />
          <Tab.Screen name="Inventory" component={AdminInventoryScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name="Shop" component={ProductsScreen} />
          <Tab.Screen name="Favourite" component={FavouriteScreen} />
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{ tabBarBadge: cartCount > 0 ? cartCount : undefined, tabBarBadgeStyle: { backgroundColor: colors.accent, color: '#fff' } }}
          />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </>
      )}
    </Tab.Navigator>
  );
}

function DrawerContent(props) {
  const { user, signOut } = useApp();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient colors={['#3E5C14', '#5E8A1F']} style={{ padding: 20, paddingTop: 36, marginTop: -4, marginBottom: 10, borderBottomRightRadius: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: '#fff' }}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Ionicons name="close" size={24} color="#fff" onPress={() => props.navigation.closeDrawer()} />
        </View>
        <Text style={{ fontWeight: '900', fontSize: 19, marginTop: 10, color: '#fff' }}>{user.name}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{user.email}</Text>
        <View style={{ alignSelf: 'flex-start', backgroundColor: colors.accent, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, marginTop: 8 }}>
          <Text style={{ fontWeight: '800', fontSize: 11, textTransform: 'capitalize', color: '#fff' }}>{user.role}</Text>
        </View>
      </LinearGradient>
      <DrawerItemList {...props} />
      <View style={{ flex: 1 }} />
      <DrawerItem
        label="Sign Out"
        labelStyle={{ color: colors.red, fontWeight: '700' }}
        icon={() => <Ionicons name="log-out-outline" size={22} color={colors.red} />}
        onPress={signOut}
      />
    </DrawerContentScrollView>
  );
}

function MainDrawer() {
  const { user } = useApp();
  const isAdmin = user.role === 'admin';
  return (
    <Drawer.Navigator
      drawerContent={(p) => <DrawerContent {...p} />}
      screenOptions={{
        headerShown: false,
        // swipe from the left edge to open, swipe back (or tap outside) to close
        swipeEnabled: true,
        swipeEdgeWidth: 120,
        swipeMinDistance: 8,
        drawerType: 'slide',
        overlayColor: 'rgba(20,30,8,0.45)',
        drawerStyle: { width: '78%', backgroundColor: '#FFFFFF' },
        drawerActiveTintColor: colors.olive,
        drawerActiveBackgroundColor: '#E8F0D5',
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: { fontWeight: '700' },
      }}
    >
      <Drawer.Screen
        name="Tabs"
        component={Tabs}
        options={{ title: isAdmin ? 'Dashboard' : 'Shop', drawerIcon: ({ color }) => <Ionicons name={isAdmin ? 'grid-outline' : 'storefront-outline'} size={22} color={color} /> }}
      />
      {isAdmin && (
        <Drawer.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{ title: 'Add Product', drawerIcon: ({ color }) => <Ionicons name="add-circle-outline" size={22} color={color} /> }}
        />
      )}
    </Drawer.Navigator>
  );
}

export default function RootNavigator() {
  const { user, ready } = useApp();
  if (!ready) {
    return (
      <LinearGradient colors={[colors.gradTop, colors.gradBottom]} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.olive} />
      </LinearGradient>
    );
  }
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        fullScreenGestureEnabled: true, // swipe back from anywhere on the screen
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainDrawer} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

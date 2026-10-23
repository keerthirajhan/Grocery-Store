import { Alert, Platform } from 'react-native';

export const notify = (title, message) => {
  if (Platform.OS === 'web') window.alert(message ? `${title}\n${message}` : title);
  else Alert.alert(title, message);
};

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isPhone = (v) => /^[6-9]\d{9}$/.test(v);

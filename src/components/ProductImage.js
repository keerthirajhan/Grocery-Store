import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { tintFor } from '../theme';

// Shows the product photo when available, otherwise a tinted emoji tile
// (used for products an admin adds without a photo).
export default function ProductImage({ item, style, emojiSize = 56 }) {
  if (item.image) {
    return <Image source={item.image} style={[styles.img, style]} resizeMode="cover" />;
  }
  return (
    <View style={[styles.img, styles.fallback, { backgroundColor: tintFor(item.name) }, style]}>
      <Text style={{ fontSize: emojiSize }}>{item.emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  img: { width: '100%', backgroundColor: '#fff' },
  fallback: { alignItems: 'center', justifyContent: 'center' },
});

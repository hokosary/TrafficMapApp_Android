import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LEVEL_META } from '../api/trafficApi';

export default function Legend() {
  return (
    <View style={styles.container}>
      {Object.entries(LEVEL_META).map(([key, meta]) => (
        <View key={key} style={styles.item}>
          <View style={[styles.circle, { backgroundColor: meta.color }]} />
          <Text style={styles.label}>{meta.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 6,
    flexWrap: 'wrap',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#222',
  },
  label: {
    fontSize: 13,
    color: '#333',
  },
});

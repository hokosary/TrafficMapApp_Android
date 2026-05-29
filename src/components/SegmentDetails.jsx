import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LEVEL_META } from '../api/trafficApi';

export default function SegmentDetails({ segment, onClose }) {
  if (!segment) return null;
  const meta = LEVEL_META[segment.level];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{segment.name}</Text>
        <TouchableOpacity onPress={onClose} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>{segment.description}</Text>

      <View style={styles.infoRow}>
        <View style={[styles.badge, { backgroundColor: meta.color }]}>
          <Text style={styles.badgeText}>{meta.label}</Text>
        </View>
        <Text style={styles.speedText}>Скорость: {segment.speedKmh} км/ч</Text>
      </View>

      <Text style={styles.updatedText}>
        Обновлено: {new Date(segment.updatedAt).toLocaleTimeString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: 17,
    color: '#222',
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  speedText: {
    fontSize: 14,
    color: '#333',
  },
  updatedText: {
    marginTop: 8,
    fontSize: 12,
    color: '#888',
  },
});

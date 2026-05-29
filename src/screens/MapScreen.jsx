import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import TrafficMap from '../components/TrafficMap';
import Legend from '../components/Legend';
import SegmentDetails from '../components/SegmentDetails';
import { fetchTrafficData } from '../api/trafficApi';

export default function MapScreen() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrafficData();
      setSegments(data);
      setLastUpdated(new Date());
      setSelected((prev) =>
        prev ? data.find((s) => s.id === prev.id) || null : null
      );
    } catch (e) {
      setError(e.message || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View style={styles.container}>
      <View style={styles.headerPanel}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Карта дорожной обстановки</Text>
          <TouchableOpacity 
            onPress={loadData} 
            disabled={loading}
            style={[styles.button, loading && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>{loading ? 'Загрузка...' : 'Обновить'}</Text>
          </TouchableOpacity>
        </View>
        <Legend />
        {lastUpdated && !loading && (
          <Text style={styles.lastUpdated}>
            Последнее обновление: {lastUpdated.toLocaleTimeString()}
          </Text>
        )}
        {error && <Text style={styles.errorText}>⚠ {error}</Text>}
      </View>

      <View style={styles.mapContainer}>
        <TrafficMap segments={segments} onSelect={setSelected} />
        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#007bff" />
              <Text style={styles.loadingText}>Загрузка данных...</Text>
            </View>
          </View>
        )}
      </View>

      {selected && (
        <View style={styles.detailsOverlay}>
          <SegmentDetails
            segment={selected}
            onClose={() => setSelected(null)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerPanel: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    margin: 0,
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#c62828',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingBox: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
  },
});

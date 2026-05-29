import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { LEVEL_META } from '../api/trafficApi';

const HTML_CONTENT = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { padding: 0; margin: 0; }
        html, body, #map { height: 100%; width: 100%; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        var map = L.map('map', { zoomControl: false }).setView([55.751244, 37.618423], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        var polylines = [];

        window.updateSegments = function(segments, levelMeta) {
            polylines.forEach(function(p) { map.removeLayer(p); });
            polylines = [];

            segments.forEach(function(segment) {
                var color = levelMeta[segment.level].color;
                
                var marker = L.circleMarker([segment.coordinates[0], segment.coordinates[1]], {
                    color: color, 
                    fillColor: color,
                    fillOpacity: 0.8,
                    radius: 8
                }).addTo(map);

                marker.on('click', function() {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'select',
                        segmentId: segment.id
                    }));
                });

                polylines.push(marker);
            });
        };
        
        // Signal that map is ready
        setTimeout(function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
        }, 500);
    </script>
</body>
</html>
`;

export default function TrafficMap({ segments, onSelect }) {
  const webViewRef = useRef(null);
  const isReady = useRef(false);

  useEffect(() => {
    if (isReady.current && webViewRef.current) {
      injectSegments();
    }
  }, [segments]);

  const injectSegments = () => {
    if (!webViewRef.current) return;
    const jsCode = `window.updateSegments(${JSON.stringify(segments)}, ${JSON.stringify(LEVEL_META)}); true;`;
    webViewRef.current.injectJavaScript(jsCode);
  };

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ready') {
        isReady.current = true;
        injectSegments();
      } else if (data.type === 'select') {
        const segment = segments.find(s => s.id === data.segmentId);
        if (segment && onSelect) {
          onSelect(segment);
        }
      }
    } catch (e) {
      console.error("WebView Message Error:", e);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: HTML_CONTENT }}
        style={styles.map}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

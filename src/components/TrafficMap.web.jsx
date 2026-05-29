import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Tooltip } from 'react-leaflet';
import { LEVEL_META } from '../api/trafficApi';

// Safely inject Leaflet CSS on Web
if (typeof document !== 'undefined') {
  const styleId = 'leaflet-css';
  if (!document.getElementById(styleId)) {
    const link = document.createElement('link');
    link.id = styleId;
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }
}

const MOSCOW_CENTER = [55.751244, 37.618423];

export default function TrafficMap({ segments, onSelect }) {
  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <MapContainer 
        center={MOSCOW_CENTER} 
        zoom={11} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {segments.map((segment) => {
          return (
            <CircleMarker
              key={segment.id}
              center={[segment.coordinates[0], segment.coordinates[1]]}
              color={LEVEL_META[segment.level].color}
              fillColor={LEVEL_META[segment.level].color}
              fillOpacity={0.8}
              radius={8}
              eventHandlers={{
                click: () => onSelect(segment),
              }}
            >
              <Tooltip sticky>{segment.name}</Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
  );
        })}
      </MapContainer>
    </div>
  );
}

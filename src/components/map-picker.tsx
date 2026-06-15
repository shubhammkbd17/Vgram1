'use client';

import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin, Compass, Search, Loader2 } from 'lucide-react';

interface MapPickerProps {
  initialLat: number;
  initialLng: number;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '16px',
};

// Seed India Coordinates
const DEFAULT_CENTER = {
  lat: 20.5937,
  lng: 78.9629,
};

export default function MapPicker({ initialLat, initialLng, onLocationSelect }: MapPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const isKeyless = !apiKey || apiKey.includes('your-');

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: isKeyless ? 'MOCK_KEY' : apiKey,
  });

  const [position, setPosition] = useState({ lat: initialLat || 28.6139, lng: initialLng || 77.2090 });
  const [addressInput, setAddressInput] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState('');

  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = React.useRef<any>(null);
  const markerRef = React.useRef<any>(null);

  useEffect(() => {
    if (isKeyless) {
      const checkLeaflet = () => {
        if ((window as any).L) {
          setLeafletLoaded(true);
        } else {
          setTimeout(checkLeaflet, 100);
        }
      };
      checkLeaflet();
    }
  }, [isKeyless]);

  // Leaflet map initialization
  useEffect(() => {
    if (isKeyless && leafletLoaded && !mapRef.current) {
      const L = (window as any).L;
      if (!L) return;

      const container = L.DomUtil.get('leaflet-picker-map');
      if (container && (container as any)._leaflet_id) {
        container._leaflet_id = null;
      }

      const map = L.map('leaflet-picker-map').setView([position.lat, position.lng], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const redIcon = L.divIcon({
        html: `<div style="display:flex; justify-content:center; align-items:center;"><i class="fa-solid fa-location-dot" style="color: #D32F2F; font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))"></i></div>`,
        className: 'custom-div-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 28]
      });

      // Add draggable marker
      const marker = L.marker([position.lat, position.lng], { icon: redIcon, draggable: true })
        .addTo(map)
        .bindPopup('<b>Drag or Click</b> to set coordinates')
        .openPopup();

      const handleMarkerMove = (lat: number, lng: number) => {
        updateLocation(lat, lng);
      };

      marker.on('dragend', function() {
        const latlng = marker.getLatLng();
        handleMarkerMove(latlng.lat, latlng.lng);
      });

      map.on('click', function(e: any) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        marker.setLatLng([lat, lng]);
        handleMarkerMove(lat, lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeyless, leafletLoaded]);

  // Synchronize Leaflet map view and marker when position changes (e.g., from initial load or searches)
  useEffect(() => {
    if (isKeyless && mapRef.current && markerRef.current) {
      const currentCenter = mapRef.current.getCenter();
      const distance = Math.abs(currentCenter.lat - position.lat) + Math.abs(currentCenter.lng - position.lng);
      
      // Update map view and marker only if position changed significantly (not from immediate marker dragging)
      if (distance > 0.0001) {
        mapRef.current.setView([position.lat, position.lng], mapRef.current.getZoom());
        markerRef.current.setLatLng([position.lat, position.lng]);
      }
    }
  }, [isKeyless, position]);

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      updateLocation(lat, lng);
    }
  };

  const updateLocation = (lat: number, lng: number) => {
    setPosition({ lat, lng });
    const fakeAddress = `Farm Location: Latitude ${lat.toFixed(4)}, Longitude ${lng.toFixed(4)}`;
    setResolvedAddress(fakeAddress);
    onLocationSelect(lat, lng, fakeAddress);
  };

  // Mock Picker Action for keyless local testing
  const handleMockClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isKeyless) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert pixel click to rough Indian coordinates
    // Top-left: (35.0, 68.0), Bottom-right: (8.0, 97.0)
    const latPercent = y / rect.height;
    const lngPercent = x / rect.width;

    const lat = 35.0 - (latPercent * (35.0 - 8.0));
    const lng = 68.0 + (lngPercent * (97.0 - 68.0));

    updateLocation(lat, lng);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-green-700" />
          <input
            type="text"
            placeholder={isKeyless ? "Enter location name manually..." : "Search farm address..."}
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm focus:outline-none focus:border-green-600 text-stone-800"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (addressInput) {
              // Geocode manually or simulate
              if (isKeyless) {
                // Simulate address resolving
                const mockLat = 20 + Math.random() * 10;
                const mockLng = 72 + Math.random() * 10;
                updateLocation(mockLat, mockLng);
                setAddressInput(`${addressInput} resolved`);
              }
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-xl flex items-center justify-center font-semibold text-sm transition-all"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {isKeyless ? (
        /* Fallback Keyless Leaflet Map Picker */
        <div className="border border-green-200 rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-amber-50 p-4 shadow-inner relative space-y-3">
          <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
            Interactive Sandbox Map Picker (Keyless Mode)
          </div>
          <p className="text-xs text-stone-500 mb-2 font-medium">
            No Google Maps Key found in `.env.local`. Click anywhere on the map or drag the pin to set coordinates.
          </p>
          
          <div
            id="leaflet-picker-map"
            className="w-full h-[250px] rounded-xl border border-green-100 z-10 shadow-md"
          >
            {!leafletLoaded && (
              <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-sm">
                <Loader2 className="w-6 h-6 animate-spin text-green-600 mr-2" /> Loading interactive picker...
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-between text-xs text-stone-600 bg-white p-2.5 rounded-xl border border-green-100">
            <span><strong>Latitude:</strong> {position.lat.toFixed(4)}</span>
            <span><strong>Longitude:</strong> {position.lng.toFixed(4)}</span>
          </div>
        </div>
      ) : !isLoaded ? (
        <div className="h-[350px] bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center text-stone-500">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      ) : (
        /* Real Google Maps Picker */
        <div className="border border-green-100 rounded-2xl overflow-hidden shadow">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={position}
            zoom={12}
            onClick={handleMapClick}
          >
            <Marker position={position} title="Your Location" />
          </GoogleMap>
        </div>
      )}
    </div>
  );
}

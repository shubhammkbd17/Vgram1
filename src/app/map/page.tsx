'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { productAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import { haversineDistance } from '@/lib/utils';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Loader2, MapPin, Compass, Tag, ShoppingCart, Info, Search } from 'lucide-react';
import Link from 'next/link';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '24px',
};

const DEFAULT_CENTER = {
  lat: 20.5937,
  lng: 78.9629,
};

export default function MapPage() {
  const { user, addToCart } = useApp();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Notification state
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const isKeyless = !apiKey || apiKey.includes('your-');

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: isKeyless ? 'MOCK_KEY' : apiKey,
  });

  const mapCenter = React.useMemo(() => {
    return user && user.location_lat && user.location_lng
      ? { lat: user.location_lat as number, lng: user.location_lng as number }
      : (products.length > 0 && products[0].producer
          ? { lat: products[0].producer.location_lat as number, lng: products[0].producer.location_lng as number }
          : DEFAULT_CENTER);
  }, [user, products]);

  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

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

      const container = L.DomUtil.get('leaflet-map');
      if (container && (container as any)._leaflet_id) {
        container._leaflet_id = null;
      }

      const map = L.map('leaflet-map').setView([mapCenter.lat, mapCenter.lng], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isKeyless, leafletLoaded]);

  // Dynamically pan map view when mapCenter updates (e.g., coordinates load or user logs in)
  useEffect(() => {
    if (isKeyless && mapRef.current) {
      mapRef.current.setView([mapCenter.lat, mapCenter.lng], mapRef.current.getZoom());
    }
  }, [isKeyless, mapCenter]);

  // Render markers dynamically
  useEffect(() => {
    if (!mapRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    const map = mapRef.current;

    // Clear old markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    const greenIcon = L.divIcon({
      html: `<div style="display:flex; justify-content:center; align-items:center;"><i class="fa-solid fa-location-pin" style="color: #1B5E20; font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))"></i></div>`,
      className: 'custom-div-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 28]
    });

    const blueIcon = L.divIcon({
      html: `<div style="display:flex; justify-content:center; align-items:center;"><i class="fa-solid fa-street-view" style="color: #1976D2; font-size: 28px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))"></i></div>`,
      className: 'custom-div-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 28]
    });

    if (user && user.location_lat && user.location_lng) {
      const buyerMarker = L.marker([user.location_lat, user.location_lng], { icon: blueIcon })
        .addTo(map)
        .bindPopup(`<b>You</b><br/>${user.full_name}`);
      markersRef.current.push(buyerMarker);
    }

    products.forEach(prod => {
      if (prod.producer && prod.producer.location_lat && prod.producer.location_lng) {
        const marker = L.marker([prod.producer.location_lat, prod.producer.location_lng], { icon: greenIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #333; min-width: 150px;">
              <h4 style="margin: 0 0 4px 0; font-weight: bold; color: #1B5E20;">${prod.title}</h4>
              <p style="margin: 0 0 6px 0; font-size: 10px; color: #666;">Farmer: ${prod.producer?.full_name}</p>
              <p style="margin: 0 0 6px 0; font-weight: bold;">₹${prod.price} / ${prod.unit}</p>
              <a href="/products/${prod.id}" style="color: #2E7D32; font-weight: bold; text-decoration: none; display: inline-block; margin-top: 4px;">View Harvest</a>
            </div>
          `);
        
        marker.on('click', () => {
          setSelectedProduct(prod);
        });

        markersRef.current.push(marker);
      }
    });
  }, [isKeyless, leafletLoaded, products, user]);

  useEffect(() => {
    fetchMapProducts();
  }, []);

  const fetchMapProducts = async () => {
    setLoading(true);
    try {
      const prods = await productAPI.getProducts();
      // Only include products with valid producer coordinates
      const validProds = prods.filter(p => p.producer && p.producer.location_lat && p.producer.location_lng);
      setProducts(validProds);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItemName(product.title);
    setTimeout(() => setAddedItemName(null), 3000);
  };



  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pb-20 space-y-8">
      
      {/* Page Header */}
      <div className="mb-8 flex items-center gap-3 border-b border-green-100 pb-4">
        <div className="p-2 bg-green-50 rounded-xl border border-green-200 text-green-700">
          <Compass className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 leading-tight">Geographical Browse</h1>
          <p className="text-sm text-stone-500">Locate farms and compare product prices based on distance parameters.</p>
        </div>
      </div>

      {addedItemName && (
        <div className="fixed bottom-6 left-6 z-50 bg-stone-900/95 backdrop-blur text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-stone-850 animate-in slide-in-from-bottom-4 duration-300">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
          <p className="text-xs font-semibold">Added **{addedItemName}** to Cart!</p>
        </div>
      )}

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Interactive Map Grid */}
          <div className="lg:col-span-2 space-y-4">
            
            {isKeyless ? (
              /* Fallback Keyless Leaflet Map */
              <div className="bg-white p-5 rounded-3xl border border-green-50 shadow-sm space-y-4">
                <div className="bg-amber-50 text-amber-800 border border-amber-200 text-xs rounded-xl p-3.5 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Interactive Sandbox Map (Keyless Mode)</p>
                    <p className="leading-relaxed mt-0.5">
                      No Google Maps key found. Displaying real interactive Leaflet map of India. Pinned locations display Rajesh (Ludhiana), Sunita (Shimla), Amit (Gujarat), and Lakshmi (Karnataka). Click on any green pin to view details!
                    </p>
                  </div>
                </div>

                <div 
                  id="leaflet-map"
                  className="w-full h-[450px] rounded-2xl border border-stone-150 overflow-hidden shadow-inner z-10"
                >
                  {!leafletLoaded && (
                    <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400 text-sm">
                      <Loader2 className="w-6 h-6 animate-spin text-green-600 mr-2" /> Loading interactive map...
                    </div>
                  )}
                </div>
              </div>
            ) : !isLoaded ? (
              <div className="h-[500px] bg-green-50 border border-green-100 rounded-3xl flex items-center justify-center text-stone-500">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              </div>
            ) : (
              /* Google Map Component */
              <div className="bg-white p-4 rounded-3xl border border-green-50 shadow-sm">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={6}
                >
                  {/* Buyer pin */}
                  {user && user.location_lat && (
                    <Marker
                      position={{ lat: user.location_lat as number, lng: user.location_lng as number }}
                      icon={{
                        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                      }}
                      title="You"
                    />
                  )}

                  {/* Products listings pins */}
                  {products.map((prod) => (
                    <Marker
                      key={prod.id}
                      position={{
                        lat: prod.producer?.location_lat as number,
                        lng: prod.producer?.location_lng as number,
                      }}
                      onClick={() => setSelectedProduct(prod)}
                      title={prod.title}
                    />
                  ))}

                  {/* Selected product Info Window */}
                  {selectedProduct && selectedProduct.producer && (
                    <InfoWindow
                      position={{
                        lat: selectedProduct.producer.location_lat as number,
                        lng: selectedProduct.producer.location_lng as number,
                      }}
                      onCloseClick={() => setSelectedProduct(null)}
                    >
                      <div className="p-2 space-y-1.5 max-w-[200px] text-stone-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={selectedProduct.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'} 
                          alt={selectedProduct.title} 
                          className="w-full h-16 rounded object-cover"
                        />
                        <h4 className="font-bold text-xs">{selectedProduct.title}</h4>
                        <p className="text-[10px] text-stone-500">Seller: {selectedProduct.producer.full_name}</p>
                        <p className="font-extrabold text-xs text-stone-900">₹{selectedProduct.price} / {selectedProduct.unit}</p>
                        <Link 
                          href={`/products/${selectedProduct.id}`}
                          className="text-[10px] text-green-700 hover:underline block font-semibold"
                        >
                          View Details
                        </Link>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </div>
            )}
          </div>

          {/* Right Column: Distance list comparative panel */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-stone-850 flex items-center gap-1">
              <Tag className="w-5 h-5 text-green-600" /> Comparison Catalog
            </h3>

            {!user && (
              <div className="bg-stone-50 border border-amber-100 p-4 rounded-2xl text-xs text-amber-800 leading-relaxed">
                💡 **Log in** to calculate exact distance filters from your specific coordinate address!
              </div>
            )}

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {products.map((prod) => {
                const isSelected = selectedProduct?.id === prod.id;
                
                // Calculate distance
                let distNum: number | null = null;
                if (user && user.location_lat && prod.producer && prod.producer.location_lat) {
                  distNum = haversineDistance(
                    user.location_lat,
                    user.location_lng,
                    prod.producer.location_lat,
                    prod.producer.location_lng
                  );
                }

                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className={`p-4 border rounded-2xl flex gap-3 items-center cursor-pointer transition-all shadow-sm ${
                      isSelected
                        ? 'border-green-600 bg-green-50/50 shadow-md'
                        : 'border-stone-100 bg-white hover:bg-stone-50'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={prod.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'} 
                      alt={prod.title} 
                      className="w-14 h-14 rounded-xl object-cover bg-stone-50 shrink-0"
                    />
                    <div className="flex-1 space-y-1 min-w-0">
                      <h4 className="font-bold text-stone-900 text-sm truncate">{prod.title}</h4>
                      <p className="text-[10px] text-stone-400 font-semibold truncate">Farmer: {prod.producer?.full_name}</p>
                      
                      <div className="flex justify-between items-center pt-1 flex-wrap gap-1">
                        <span className="text-xs font-bold text-stone-800">₹{prod.price} <span className="text-[10px] font-normal text-stone-500">/ {prod.unit}</span></span>
                        
                        {distNum !== null && (
                          <span className="text-[10px] text-stone-500 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5 shrink-0">
                            <MapPin className="w-2.5 h-2.5 text-red-500" /> {distNum.toFixed(1)} km
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}


import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Location {
  lat: number;
  lng: number;
}

interface DeliveryMapProps {
  shopLocation: Location;
  customerLocation?: Location;
  apiKey?: string;
}

const DeliveryMap = ({ shopLocation, customerLocation, apiKey }: DeliveryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(apiKey || '');

  useEffect(() => {
    if (!mapContainer.current || !customerLocation) return;
    if (!mapboxToken) {
      console.error('Mapbox token is required for the map to display');
      return;
    }

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    try {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend([shopLocation.lng, shopLocation.lat]);
      bounds.extend([customerLocation.lng, customerLocation.lat]);

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        bounds: bounds,
        // Using fitBoundsOptions instead of direct padding property
        fitBoundsOptions: {
          padding: 50
        }
      });

      // Add markers
      new mapboxgl.Marker({ color: '#FF0000' })
        .setLngLat([shopLocation.lng, shopLocation.lat])
        .addTo(map.current);

      new mapboxgl.Marker({ color: '#0000FF' })
        .setLngLat([customerLocation.lng, customerLocation.lat])
        .addTo(map.current);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Cleanup
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [shopLocation, customerLocation, mapboxToken]);

  // If we don't have a token, render a form to input it
  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
        <p className="mb-4 text-center">Please enter your Mapbox public token to display the map</p>
        <div className="w-full max-w-md">
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded mb-2" 
            placeholder="Enter Mapbox public token"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Get your token from <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Mapbox</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default DeliveryMap;

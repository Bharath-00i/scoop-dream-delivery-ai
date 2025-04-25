
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Location {
  lat: number;
  lng: number;
}

interface DeliveryMapProps {
  shopLocation: Location;
  customerLocation?: Location;
}

const DeliveryMap = ({ shopLocation, customerLocation }: DeliveryMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !customerLocation) return;

    // Initialize map
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your Mapbox token
    
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([shopLocation.lng, shopLocation.lat]);
    bounds.extend([customerLocation.lng, customerLocation.lat]);

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      bounds: bounds,
      padding: 50
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
  }, [shopLocation, customerLocation]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default DeliveryMap;

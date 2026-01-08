'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Dynamically import leaflet.heat only on the client side
const importLeafletHeat = () => import('leaflet.heat');


import type { Intervention, Zone } from '@/lib/types';
import { getSimulatedLocationData } from '@/app/actions/location';
import { Skeleton } from '../ui/skeleton';

// Fix for default icon issue with Leaflet and Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type MapViewProps = {
  interventions: Intervention[];
  zones: Zone[];
};

const interventionIcons: { [key: string]: string } = {
  'Amine Scrubber': 'building',
  'Roadside DAC': 'wind',
  'Vertical Garden': 'leaf',
  'Algal Bioreactor': 'droplets',
  'Biofilter': 'cog',
};

const createIcon = (type: string) => {
  const iconType = interventionIcons[type] || 'cog';
  let iconHtml = '';
  let colorClass = '';

  // Icon SVGs and colors based on intervention type
  switch (iconType) {
    case 'building': // Amine Scrubber
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`;
      colorClass = 'bg-orange-500';
      break;
    case 'wind': // Roadside DAC
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`;
      colorClass = 'bg-teal-500';
      break;
    case 'leaf': // Vertical Garden
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;
      colorClass = 'bg-green-500';
      break;
    default: // Biofilter, Algal Bioreactor, etc.
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg>`;
      colorClass = 'bg-gray-500';
  }

  return L.divIcon({
    html: `<div class="flex items-center justify-center h-8 w-8 rounded-full ${colorClass} text-white shadow-lg border-2 border-white/80">${iconHtml}</div>`,
    className: 'bg-transparent border-0',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// This function now runs only on the client
const generateClientHeatmapData = () => {
    const data: [number, number, number][] = [];
    const indiaBounds = {
      minLat: 8.4,
      maxLat: 37.6,
      minLng: 68.7,
      maxLng: 97.25,
    };

    const majorCities = [
        { lat: 28.61, lng: 77.23, intensity: 1.0, radius: 2.5 },   // Delhi
        { lat: 19.07, lng: 72.87, intensity: 1.0, radius: 2.5 },   // Mumbai
        { lat: 22.57, lng: 88.36, intensity: 0.9, radius: 2 },     // Kolkata
        { lat: 13.08, lng: 80.27, intensity: 0.85, radius: 2 },    // Chennai
        { lat: 12.97, lng: 77.59, intensity: 0.8, radius: 2 },     // Bangalore
        { lat: 17.38, lng: 78.48, intensity: 0.75, radius: 1.8 },  // Hyderabad
        { lat: 26.91, lng: 75.78, intensity: 0.7, radius: 1.5 },   // Jaipur
        { lat: 23.25, lng: 77.41, intensity: 0.6, radius: 1.5 },   // Bhopal
        { lat: 30.73, lng: 76.77, intensity: 0.65, radius: 1.2 },  // Chandigarh
        { lat: 25.59, lng: 85.13, intensity: 0.6, radius: 1.2 },   // Patna
        { lat: 21.14, lng: 79.08, intensity: 0.55, radius: 1.2 },  // Nagpur
    ];

    // Generate dense points around major cities
    for (const city of majorCities) {
        for (let i = 0; i < 500; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * city.radius;
            data.push([
                city.lat + distance * Math.cos(angle),
                city.lng + distance * Math.sin(angle),
                Math.random() * city.intensity
            ]);
        }
    }
    
    // Generate a large number of random points across India for broader coverage
    const numberOfPoints = 15000;
    for (let i = 0; i < numberOfPoints; i++) {
        const lat = indiaBounds.minLat + Math.random() * (indiaBounds.maxLat - indiaBounds.minLat);
        const lng = indiaBounds.minLng + Math.random() * (indiaBounds.maxLng - indiaBounds.minLng);
        const intensity = Math.pow(Math.random(), 3) * 0.4;
        data.push([lat, lng, intensity]);
    }
    return data;
}

export default function MapView({ interventions, zones }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const interventionMarkers = useRef<L.Marker[]>([]);
  const popupRef = useRef<L.Popup | null>(null);
  const [isClient, setIsClient] = useState(false);

  // This ensures that all map logic runs only on the client side.
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
        center: [22.35, 79.09], // Center of India
        zoom: 5,
        scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance.current);

    // Dynamically import and use leaflet.heat
    importLeafletHeat().then(() => {
      if (mapInstance.current) {
        const heatmapData = generateClientHeatmapData();
        if (heatmapData.length > 0) {
          (L as any).heatLayer(heatmapData, {
            radius: 25,
            blur: 20,
            maxZoom: 10,
            max: 1.0,
            gradient: { 0.4: 'yellow', 0.65: 'orange', 1: 'red' },
          }).addTo(mapInstance.current);
        }
      }
    });

    mapInstance.current.on('click', async (e) => {
        if (!mapInstance.current) return;

        const { lat, lng } = e.latlng;

        if (popupRef.current) {
          popupRef.current.remove();
        }

        popupRef.current = L.popup()
          .setLatLng(e.latlng)
          .setContent('<p>Loading environmental data...</p>')
          .openOn(mapInstance.current);

        const data = await getSimulatedLocationData(lat, lng);
        
        if (popupRef.current) {
          if (data) {
             const content = `
              <div class="p-1">
                <h3 class="font-bold text-base mb-2">Environmental Data</h3>
                <div class="space-y-1 text-sm">
                  <p><strong>CO₂ Level:</strong> ${data.co2.toFixed(2)} ppm</p>
                  <p><strong>Air Quality (AQI):</strong> ${data.aqi}</p>
                  <p><strong>Status:</strong> ${data.aqiDescription}</p>
                </div>
              </div>
            `;
            popupRef.current.setContent(content);
          } else {
            popupRef.current.setContent('<p>Could not retrieve data.</p>');
          }
        }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isClient]);

  useEffect(() => {
    if (isClient && mapInstance.current) {
      const map = mapInstance.current;
      
      interventionMarkers.current.forEach(marker => map.removeLayer(marker));
      interventionMarkers.current = [];
      
      interventions.forEach((intervention) => {
        if (!intervention.placement) return;
        const marker = L.marker([intervention.placement.lat, intervention.placement.lng], {
          icon: createIcon(intervention.type),
          draggable: true,
        })
          .addTo(map)
          .bindTooltip(
            `<p class="font-semibold">${intervention.type}</p><p class="text-sm text-muted-foreground">Status: ${intervention.status}</p>`
          );
        interventionMarkers.current.push(marker);
      });
    }
  }, [interventions, isClient]);

  // Show a skeleton loader until the client-side has mounted.
  if (!isClient) {
      return <Skeleton className="h-full w-full rounded-lg" />;
  }

  return (
      <div ref={mapRef} className="h-full w-full rounded-lg" />
  );
}

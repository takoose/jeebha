import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

interface RoutingProps {
  from: [number, number];
  to: [number, number];
  color?: string;
  waypoints?: [number, number][];
}

export default function Routing({ from, to, color = '#FACC15', waypoints }: RoutingProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const allWaypoints = [
      L.latLng(from[0], from[1]),
      ...(waypoints?.map(w => L.latLng(w[0], w[1])) || []),
      L.latLng(to[0], to[1])
    ];

    const routingControl = L.Routing.control({
      waypoints: allWaypoints,
      lineOptions: {
        styles: [{ color, weight: 6, opacity: 0.8 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      show: false, // Hide the textual directions panel by default
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      // @ts-ignore - plugin specific
      createMarker: () => null // We handle markers ourselves in the main map
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        try {
          routingControl.getPlan()?.setWaypoints([]);
          map.removeControl(routingControl);
        } catch (e) {
          console.warn("Leaflet routing cleanup error:", e);
        }
      }
    };
  }, [from, to, map, color, waypoints]);

  return null;
}

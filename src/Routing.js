import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';

const Routing = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Create routing control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(27.6758251, 85.3853204),
        L.latLng(27.676330883081924, 85.38403462126658), // Start point
        L.latLng(17.384, 78.4866),
        L.latLng(27.681038, 85.386021),
        L.latLng(), // Midpoint
        L.latLng(12.971, 77.5945), // End point
      ],
      lineOptions: {
        styles: [{ color: 'blue', opacity: 0.6, weight: 4 }],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
    }).addTo(map);

    // Clean up the routing control when component unmounts
    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map]);

  return null;
};

export default Routing;

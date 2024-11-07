import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const Routing = ({ zoomLevel, locations }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    let routingControl;
    let routeLine;

    // Filter locations based on zoom level
    const filteredLocations = locations.filter((location) => {
      if (zoomLevel === 13 || zoomLevel === 14) {
        return location.importance === "high"; // Only show high-importance locations at zoom 13 and 14
      } else if (zoomLevel > 14) {
        return true; // Show all locations at zoom levels above 14
      }
      return false; // Don't show any locations if zoom level is below 13
    });

    // Define waypoints based on filtered locations
    const waypoints = filteredLocations.map((location) => L.latLng(location.position));

    // Add routing control with the filtered waypoints
    routingControl = L.Routing.control({
      waypoints: waypoints,
      lineOptions: {
        styles: [{ color: "blue", opacity: 0.6, weight: 2 }],
      },
      createMarker: () => null, // No markers
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false, // Prevent auto-zooming to fit route
      showAlternatives: false,
      routeWhileDragging: false,
    }).addTo(map);

    // Draw a route line when routes are found
    routingControl.on("routesfound", (e) => {
      const route = e.routes[0];
      routeLine = L.polyline(route.coordinates, {
        color: "blue",
        weight: zoomLevel > 14 ? 4 : 2, // Adjust weight based on zoom
        opacity: 0.6,
      }).addTo(map);
    });

    // Adjust line weight on zoom change
    const updateLineWeight = () => {
      if (routeLine) {
        const weight = map.getZoom() > 14 ? 4 : 2;
        routeLine.setStyle({ weight });
      }
    };

    // Update route display on zoom end
    map.on("zoomend", updateLineWeight);

    // Cleanup function to remove routing and route line
    return () => {
      if (routingControl) {
        routingControl.getPlan().setWaypoints([]);
        map.removeControl(routingControl);
      }
      if (routeLine) {
        map.removeLayer(routeLine);
      }
      map.off("zoomend", updateLineWeight);
    };
  }, [map, locations, zoomLevel]);

  return null;
};

export default Routing;

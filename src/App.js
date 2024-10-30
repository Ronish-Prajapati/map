import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "./App.css";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import iconUrl from "./location.png";


import renderMarkers from "./RenderMarkers";
const boundaryCoordinates = [
  [27.66763697313941, 85.35216675390043],
  [27.668834225932258, 85.36098585696696],
  [27.669765413480274, 85.36405430401932],
  [27.672710954543454, 85.36506281473454],
  [27.67058257157745, 85.36881790728114],
  [27.671437730434246, 85.37765846819335],
  [27.670050469344357, 85.37722931476964],
  [27.668986257132115, 85.3786026057581],
  [27.671912815812746, 85.38263664816742],
  [27.670810614615583, 85.38585529892164],
  [27.670677589589815, 85.39426670644795],
  [27.672577931854274, 85.39598332018355],
  [27.67371812136923, 85.39991007418558],
  [27.676967596201084, 85.4030858096758],
  [27.67774669567046, 85.405531984249],
  [27.68230716654712, 85.40578947629702],
  [27.68217415551162, 85.40559635725175],
  [27.68432131385624, 85.40061817741856],
  [27.697869075605247, 85.39890039664247],
  [27.701495583406466, 85.39615775736505],
  [27.700600949520645, 85.39541796651753],
  [27.70063290085714, 85.3953638354799],
  [27.70259789011064, 85.3928377202952],
  [27.702086676785257, 85.38933724644683],
  [27.700776681769398, 85.38818245097754],
  [27.697230030946564, 85.38973420738868],
  [27.696622934979043, 85.38679308762676],
  [27.69595193029479, 85.38488045763073],
  [27.69235719210412, 85.38486241395152],
  [27.694134780669227, 85.38118326786362],
  [27.69295042097213, 85.37801314056802],
  [27.694428241816897, 85.37597997658506],
  [27.690720217121513, 85.37581307506825],
  [27.690464949918336, 85.37431096141704],
  [27.692332417247417, 85.37182261153018],
  [27.688825851424788, 85.37003221331064],
  [27.688194388930736, 85.3676955920754],
  [27.681449604154697, 85.35988156631977],
  [27.682417009216024, 85.35701389480383],
  [27.678103928862946, 85.35501107654702],
  [27.676007790892243, 85.35624007861209],
  [27.667699116874797, 85.352130139388],
  [27.668841335141643, 85.36093040131355],
];
// ZoomHandler component to track zoom level
function ZoomHandler({ setZoomLevel }) {
  const map = useMap();

  useEffect(() => {
    map.on("zoomend", () => {
      setZoomLevel(map.getZoom());
    });
  }, [map, setZoomLevel]);

  return null;
}

// const Routing = () => {
//   const map = useMap();

//   useEffect(() => {
//     if (!map) return; // Ensure the map is loaded

//     const waypoints = locations.map((location) => L.latLng(location.position));

//     // Create routing control
//     const routingControl = L.Routing.control({
//       waypoints: waypoints,
//       lineOptions: {
//         styles: [{ color: "blue", opacity: 0.6, weight: 2 }] // Default weight
//       },
//       formatter: new L.Routing.Formatter({
//         formatInstruction: () => '' // Empty instructions
//       }),
//       createMarker: () => null, // Hides default markers
//       addWaypoints: false,
//       draggableWaypoints: false,
//       fitSelectedRoutes: true,
//       showAlternatives: false,
//       routeWhileDragging: false,
//       show: false
//     }).addTo(map);

//     // Store a reference to the route line
//     let routeLine;

//     // Update the route line when routes are found
//     routingControl.on('routesfound', (e) => {
//       const route = e.routes[0];
//       routeLine = L.polyline(route.coordinates, {
//         color: 'blue',
//         weight: 2, // Set initial weight
//         opacity: 0.6,
//       }).addTo(map);
//     });

//     // Function to update line weight based on zoom level
//     const updateLineWeight = (zoom) => {
//       if (routeLine) {
//         const weight = zoom < 14 ? 2 : 2; // Set weight based on zoom level
//         routeLine.setStyle({ weight }); // Update the polyline's weight
//       }
//     };

//     // Update line weight when the zoom level changes
//     map.on('zoomend', () => {
//       const zoom = map.getZoom();
//       updateLineWeight(zoom);
//     });

//     // Clean up routing control on component unmount
//     return () => {
//       if (map && routingControl) {
//         routingControl.getPlan().setWaypoints([]);
//         map.removeControl(routingControl); // Cleanly remove the routing control
//       }
//       // Remove the route line if it exists
//       if (routeLine) {
//         map.removeLayer(routeLine);
//       }
//     };
//   }, [map]);

//   return null;
// };

// Main App component
function App() {
  const [zoomLevel, setZoomLevel] = useState(14); // Initial zoom level
  const position = [27.684648411519873, 85.38485866820957]; // Initial map position
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('https://data-psi-six.vercel.app/locations.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setLocations(data.location);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (isLoading) {
    return <div>Loading locations...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Dynamically create the custom icon based on zoom level
  const createCustomIcon = (zoom) => {
    let iconSize;
    if (zoom >= 15) {
      iconSize = [28, 28]; // Zoom level 15 or more
    } else if (zoom >= 14) {
      iconSize = [30, 30];
    } else if (zoom >= 13) {
      iconSize = [15, 15]; // Zoom level 13 to 14
    } else if (zoom >= 11) {
      iconSize = [0, 0]; // Zoom level 11 to 12
    } else {
      iconSize = [0, 0]; // Zoom level 10 or below
    } // Adjust size based on zoom level
    const iconAnchor = [iconSize[0] / 2, iconSize[1]]; // Center bottom for anchor
    const popupAnchor = [0, -iconSize[1]]; // Above the icon

    return L.icon({
      iconUrl: iconUrl, // Replace with your icon URL
      iconSize: iconSize, // Dynamic size
      iconAnchor: iconAnchor, // Dynamic anchor based on icon size
      popupAnchor: popupAnchor, // Adjust popup based on icon size
    });
  };
 

  return (
    <>
      <div
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <MapContainer
          center={position} // Set initial center coordinates
          zoom={zoomLevel}
          scrollWheelZoom={false}
          style={{ height: "500px", width: "100%" }}
        >
          {/* Tile layer for map display */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />

          {/* Component to handle zoom level changes */}
          <ZoomHandler setZoomLevel={setZoomLevel} />
          {renderMarkers(zoomLevel, locations, createCustomIcon)}

          <Polygon
            positions={boundaryCoordinates} // Add your boundary coordinates here
            pathOptions={{
              color: "black",
              fillColor: "none",
              // No blur inside polygon
            }}
          />

          {/* {zoomLevel > 14 && <Routing />}  */}
        </MapContainer>
      </div>
    </>
  );
}

export default App;

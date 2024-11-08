import React from "react";

import { Marker, Popup } from "react-leaflet";
import "./App.css";
import icon from "./right-arrow.png";

function RenderMarkers(zoomLevel, locations, createCustomIcon) {
  // Filter locations based on zoom level and importance

  const filteredLocations = locations.filter((location) => {
    if (zoomLevel === 14 || zoomLevel === 13) {
      return location.importance === "high"; // Only show high-importance locations at zoom 14
    } else if (zoomLevel > 13) {
      return true; // Show all locations at zoom level higher than 14
    }
    return false; // Don't show markers if zoom is less than 14
  });
  
  // Map through filtered locations and render markers
  return filteredLocations.map((location, index) => (
    <Marker
      key={index}
      position={location.position}
      icon={createCustomIcon(zoomLevel)} // Dynamic icon based on zoom level
    >
      <Popup
        keepInView={true}
        closeButton={true}
        autoPan={true}
        autoPanPadding={[50,50]}
        onOpen={(e) => {
          const map = e.target._map; // Access the map instance associated with the popup

          // Reset the view or center on the popup's location without reapplying padding
          map.panTo(e.target.getLatLng(27.673457, 85.385284), { animate: true });
        }}
      >
        <div className="popup-container">
          <img
            src={location.imageUrl}
            alt={location.name}
            className="popup-image popup-sm-image"
          />
        </div>
        <div style={{textAlign:"center"}}>
          <a
          target="_blank" 
            href={location.info}
            style={{ color: "#202124", textDecoration: "none" }}
          >
            <h4
              style={{
                margin: "5px 0 5px",
                fontFamily: "Helvetica",
                fontSize: "1.2rem",
                
              }}
            >
              {location.name}
            </h4>
          </a>

          <a  target="_blank" href={location.direction} className="popup-link">
            Get Direction
          </a>
        </div>
      </Popup>
    </Marker>
  ));
}

export default RenderMarkers;

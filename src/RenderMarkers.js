import React from "react";

import { Marker, Popup } from "react-leaflet";
import "./App.css";

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
      <Popup>
        <div className="popup-container">
          <img
            src={location.imageUrl}
            alt={location.name}
            className="popup-image"
          />
          <h4 style={{ margin: "10px 0 5px" }}>{location.name}</h4>
          <p className="description" style={{ fontSize: "14px", margin: "0" }}>
            {location.description}
          </p>
          <a href={location.direction} className="popup-link">
            Get Direction
          </a>
          <br />
          <a href={location.info} className="popup-link">
            More Info
          </a>
        </div>
      </Popup>
    </Marker>
  ));
}

export default RenderMarkers;

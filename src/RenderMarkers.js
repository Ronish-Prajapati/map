import React from "react";
import { Marker, Popup } from "react-leaflet";


function renderMarkers(zoomLevel, locations, createCustomIcon) {
  // Filter locations based on zoom level and importance
  const filteredLocations = locations.filter((location) => {
    if (zoomLevel === 14) {
      return location.importance === "high"; // Only show high-importance locations at zoom 14
    } else if (zoomLevel > 14) {
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
        <div
          style={{
            textAlign: "center",
            maxWidth: "250px",
            overflow: "hidden",
          }}
        >
          <img
            src={location.imageUrl}
            alt={location.name}
            style={{
              width: "90%",
              maxHeight: "150px",
              height: "100%",
              borderRadius: "8px",
              objectFit: "cover",
              display: "block",
              margin: "0 auto",
            }}
            // onerror="this.onerror=null; this.src='${plugins_url}/build/static/media/default-temple.jpg';"
          />
          <h4 style={{ margin: "10px 0 5px" }}>{location.name}</h4>
          <p style={{ fontSize: "14px", margin: "0" }}>{location.description}</p>
          <a href={location.direction} style={{ padding: "2px",textDecoration:'none', fontSize:'15px'}}>Get Direction</a>
          <br />
          <a href={location.info} style={{ padding: "2px",textDecoration:'none', fontSize:'15px'}}>More Info</a>
        </div>
      </Popup>
    </Marker>
  ));
}

export default renderMarkers;

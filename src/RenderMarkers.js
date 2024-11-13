import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./App.css";

function RenderMarkers(zoomLevel, locations) {
  // Function to create numbered icon
  const createNumberedIcon = (index, zoomLevel) => {
    const iconSize = zoomLevel === 13 ? 15 : 25; // Set size based on zoom level
  
    return L.divIcon({
      html: `<div style="position: relative; background-color: #ff4d4d; color: white; border-radius: 50%; width: ${iconSize}px; height: ${iconSize}px; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                ${index + 1}
             </div>`,
      className: "custom-icon",
      iconSize: [iconSize, iconSize], // Dynamic icon size
    });
  };
  

  const filteredLocations = locations.filter((location) => {
    if (zoomLevel === 14 || zoomLevel === 13) {
      return location.importance === "high";
    } else if (zoomLevel > 13) {
      return true;
    }
    return false;
  });

  return filteredLocations.map((location, index) => (
    <Marker
      key={index}
      position={location.position}
      icon={createNumberedIcon(index,zoomLevel)}
    >
      <Popup
        keepInView={true}
        closeButton={true}
        autoPan={true}
        autoPanPadding={[50, 50]}
        onOpen={(e) => {
          const map = e.target._map;
          map.panTo(e.target.getLatLng(), { animate: true });
        }}
      >
        <div className="popup-container">
          <img
            src={location.imageUrl}
            alt={location.name}
            className="popup-image popup-sm-image"
          />
        </div>
        <div style={{ textAlign: "center" }}>
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
              {index + 1}. {location.name}
            </h4>
          </a>
          <a target="_blank" href={location.direction} className="popup-link">
            Get Direction
          </a>
        </div>
      </Popup>
    </Marker>
  ));
}

export default RenderMarkers;

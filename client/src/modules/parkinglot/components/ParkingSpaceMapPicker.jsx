import { useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultCenter = [16.4023, 120.596];

const MapClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(event) {
      onSelect(event.latlng);
    },
  });

  return null;
};

const ParkingSpaceMapPicker = ({ value, onChange }) => {
  const center = useMemo(() => {
    if (value?.latitude && value?.longitude) {
      return [Number(value.latitude), Number(value.longitude)];
    }

    return defaultCenter;
  }, [value]);

  return (
    <div>
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: 320, width: "100%", borderRadius: 12, overflow: "hidden" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler
          onSelect={(latlng) =>
            onChange({
              latitude: latlng.lat,
              longitude: latlng.lng,
            })
          }
        />
        {value?.latitude && value?.longitude ? (
          <Marker position={[Number(value.latitude), Number(value.longitude)]} />
        ) : null}
      </MapContainer>
      <div style={{ marginTop: 12, color: "#666" }}>
        Click the map to set the parking space location.
      </div>
      {value?.latitude && value?.longitude ? (
        <div style={{ marginTop: 8 }}>
          Lat: {Number(value.latitude).toFixed(6)}, Lng: {Number(value.longitude).toFixed(6)}
        </div>
      ) : null}
    </div>
  );
};

export default ParkingSpaceMapPicker;

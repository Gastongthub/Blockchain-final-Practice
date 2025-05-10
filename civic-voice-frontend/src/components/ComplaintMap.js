import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function ComplaintMap({ complaints }) {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {complaints.map((complaint) => (
        <Marker position={[complaint.lat, complaint.lng]}>
          <Popup>
            <h3>{complaint.description}</h3>
            <p>Status: {complaint.status}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
import "./App.css";
import "./styles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import axios from "axios";
import { useMap } from 'react-leaflet';
import { useState, useEffect } from 'react';



// create custom icon
const customIcon = new Icon({
  iconUrl: require("./icons/placeholder.png"),
  iconSize: [38, 38] // size of the icon
});
// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true)
  });
};
// markers
const markers = [
  {
    geocode: [48.86, 2.3522],
    popUp: "Hello, I am pop up 1"
  },
  {
    geocode: [48.85, 2.3522],
    popUp: "Hello, I am pop up 2"
  },
  {
    geocode: [48.855, 2.34],
    popUp: "Hello, I am pop up 3"
  }
];

export default function App() {
  const [pincode, setPincode] = useState("");
  const [searchedMarker, setSearchedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState([48.8566, 2.3522]);

  useEffect(() => {
    // Update the map center when searchedMarker changes
    if (searchedMarker) {
      setMapCenter(searchedMarker);
    }
  }, [searchedMarker]);

  const handleSearch = async (pincode) => {
    const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY;// replace with your OpenCage API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setSearchedMarker([lat, lng]);
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const ChangeView = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  }


  return (
    <div id="app-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />

        <button onClick={() => handleSearch(pincode)}>Search</button>

      </div>
      <MapContainer className="leaflet-container" center={mapCenter} zoom={13}>
      <ChangeView center={mapCenter} />
        {/* OPEN STREEN MAPS TILES */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {/* Mapping through the markers */}
          {markers.map((marker, index) => (
            <Marker key={index} position={marker.geocode} icon={customIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}

          {/* Display the searched marker */}
          {searchedMarker && (
            <Marker position={searchedMarker} icon={customIcon}>
              <Popup>Pincode Location</Popup>
            </Marker>
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
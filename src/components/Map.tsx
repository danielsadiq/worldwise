import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
// import { useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useEffect, useState } from "react";
import { useGeolocation } from "../hooks/useGeoLocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";
function Map() {
  const {cities} = useCities();
  const [mapPosition, setMapPosition] = useState({lat:43.5169331,lng:-2.3899295});
  const {isLoading:isLoadingPosition, position:geoLocPosition, getPosition} = useGeolocation();
  const {lat, lng} = useUrlPosition();

  useEffect(function(){
    if(lat && lng) setMapPosition({lat:lat, lng:lng});
  },[lat, lng]);

  useEffect(()=>{
    if (geoLocPosition) setMapPosition(geoLocPosition);
  },[geoLocPosition])

  return (
    <div className={styles.mapContainer}>
      {!geoLocPosition && <Button type="position" onClick={getPosition}>{isLoadingPosition ? "Loading..." : "Use your position"}</Button>}
      <MapContainer
        center={{lat,lng}}
        zoom={6}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map(city => <Marker position={city.position} key={city.id}>
          <Popup>
           <span> {city.emoji} </span><span>{city.cityName}</span>
          </Popup>
        </Marker>)}
        <ChangeCenter position={mapPosition} />
        <DetectClick/>
      </MapContainer>
    </div>
  );
}

function ChangeCenter({position}:{position:{lat:number,lng:number}}){
  const map = useMap();
  map.setView(position);
  return null
}

function DetectClick(){
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    },
    locationfound: (location) => {
      console.log('location found:', location)
    },
  })
  return null
}

export default Map;

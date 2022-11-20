import React, { useState, useRef, useEffect } from 'react'
import '../../styles/maincomponents/MainIndex.css'
import { GoogleMap, withGoogleMap, withScriptjs, Polygon, InfoWindow, Marker } from 'react-google-maps';
import Axios from 'axios'
import QCPath from '../../json/QCPath.json'
import IconsDisplay from '../../json/IconsDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion'
import { URL } from '../../json/urlconfig'

function Map(){

  const dispatch = useDispatch()

  const google = window.google;

  const [zoomlevel, setzoomlevel] = useState(17)
  const [centerMap, setcenterMap] = useState({ lat: 14.647296, lng: 121.061376 });
  // const [selectedMarker, setselectedMarker] = useState(null);
  const MapRef = useRef(null);

  useEffect(() => {
    // console.log(MapRef.current)

    return () => {
      // dispatch({ type: SET_CENTER_MAP, centermap: { lat: 14.647296, lng: 121.061376 }})
    }
  },[])

  return(
    <GoogleMap
      ref={MapRef} 
      defaultZoom={17}
      center={centerMap}
      options={{
        gestureHandling:'greedy',
        zoomControlOptions: { position: 3 },
        streetViewControl:false,
        fullscreenControl:false,
        maxZoom: 0,
        minZoom: 12,
        disableDefaultUI: true,
        style: IconsDisplay,
        mapTypeId: 'satellite' //roadmap, satellite, terrain, hybrid
      }}
    >
      <Polygon
        draggable={false}
        editable={false}
        paths={[QCPath.coordinates[0][0], QCPath.coordinates[0][0]]}
        options={{
          fillColor: "transparent",
          strokeColor: "red"
        }}
      />
    </GoogleMap>
  )
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

function MapRoute(){
  return(
    <WrappedMap
      googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAeogbvkQJHv5Xm0Ph_O_ehNWBxkdr_1CU`}
      loadingElement={<div style={{height: '100%'}} />}
      containerElement={<div style={{height: '100%'}} />}
      mapElement={<div style={{height: '100%'}} />} 
    />
  )
}

function MainIndex() {
  return (
    <div id='divMainIndex'>
      <MapRoute />
    </div>
  )
}

export default MainIndex
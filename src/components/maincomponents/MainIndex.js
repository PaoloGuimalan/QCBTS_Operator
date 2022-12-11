import React, { useState, useRef, useEffect } from 'react'
import '../../styles/maincomponents/MainIndex.css'
import { GoogleMap, withGoogleMap, withScriptjs, Polygon, InfoWindow, Marker, Polyline } from 'react-google-maps';
import Axios from 'axios'
import QCPath from '../../json/QCPath.json'
import IconsDisplay from '../../json/IconsDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion'
import { URL } from '../../json/urlconfig'
import OpennedIcon from '../../resources/imgs/OpenStop.png'
import ClosedIcon from '../../resources/imgs/ClosedStop.png'
import { SET_BUS_STOP_INFO, SET_MAP_MODE, SET_ROUTE_MAKER_LIST, SET_SELECTED_MARKER } from '../../redux/types';

function Map(){

  const routemakerlist = useSelector(state => state.routemakerlist);
  const busstopslist = useSelector(state => state.busstopslist);
  const mapmode = useSelector(state => state.mapmode);
  const selectedmarker = useSelector(state => state.selectedmarker);
  const routepath = useSelector(state => state.routepath);
  const routestatusloader = useSelector(state => state.routestatusloader);
  const savedroutepath = useSelector(state => state.savedroutepath);

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

  const routeCallAPI = (data) => {
    if(mapmode == "routes"){
      Axios.get(`https://us1.locationiq.com/v1/directions/driving/-0.11814675,51.512788;-0.12694005,51.507848?key=pk.2dd9b328ed0803c41448fc0c3ba30cd4&steps=true&alternatives=true&geometries=polyline&overview=full`)
      .then((response) => {
        // console.log(response.data);
        // setcenterMap({ lat: parseFloat(response.data.lat), lng: parseFloat(response.data.lon) })
        console.log(response.data)
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

  const fetchBusStopData = (id) => {
    Axios.get(`${URL}/company/busStopDetails/${id}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        console.log(response.data.result)
        dispatch({ type: SET_BUS_STOP_INFO, busstopinfo: response.data.result })
        dispatch({ type: SET_MAP_MODE, mapmode: "bus_stops" })
      }
      else{
        console.log(response.data.result.message)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

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
      {busstopslist.map((data, i) => {
        return(
          <Marker
            icon={{
              url: data.status? OpennedIcon : ClosedIcon,
              anchor: new google.maps.Point(15, 15),
              scaledSize: new google.maps.Size(25, 25),
            }}
            onClick={() => { dispatch({ type: SET_SELECTED_MARKER, selectedmarker: data.busStopID }) }}
            key={i}
            position={{lat: parseFloat(data.coordinates.latitude), lng: parseFloat(data.coordinates.longitude)}}
          >
            {selectedmarker == data.busStopID? (
              <InfoWindow onCloseClick={() => {
                dispatch({ type: SET_SELECTED_MARKER, selectedmarker: null })
              }}>
                <div className='div_infowindow_existing_bs'>
                  <p id='p_stationName'>{data.stationName}</p>
                  <table id='table_existing_bs'>
                    <tbody>
                      <tr>
                        <th>Bus Stop ID</th>
                        <td>{data.busStopID}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <motion.td
                        animate={{
                          color: data.status? "lime" : "red"
                        }}
                        >{data.status? "Open" : "Closed"}</motion.td>
                      </tr>
                      <tr>
                        <th>Date Added</th>
                        <td>{data.dateAdded}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div id='div_btns_infowinfow'>
                    <motion.button
                    animate={{
                      backgroundColor: "lime",
                      display: mapmode == "routes"? "block" : "none"
                    }}
                    className='btn_infoWindow_existing_bs' onClick={() => { 
                      dispatch({ type: SET_ROUTE_MAKER_LIST, routemakerlist: [
                      ...routemakerlist,
                      {
                        pendingID: Math.floor(Math.random() * 100000),
                        stationID: data.busStopID,
                        stationName: data.stationName,
                        coordinates: [
                          data.coordinates.longitude,
                          data.coordinates.latitude
                        ]
                      }] }) 
                      dispatch({ type: SET_SELECTED_MARKER, selectedmarker: null })
                    }}>{routemakerlist.length == 0? "Create Route" : "Add to Routes"}</motion.button>
                    <button className='btn_infoWindow_existing_bs' onClick={() => { fetchBusStopData(data.busStopID) }}>View Details</button>
                  </div>
                </div>
              </InfoWindow>
            ) : null}
          </Marker>
        )
      })}
      <Polygon
        draggable={false}
        editable={false}
        paths={[QCPath.coordinates[0][0], QCPath.coordinates[0][0]]}
        options={{
          fillColor: "transparent",
          strokeColor: "grey"
        }}
      />
      {routepath.length != 0? (
        <Polyline
          draggable={false}
          editable={false}
          path={routepath}
          options={{
            fillColor: "transparent",
            strokeColor: "orange",
            strokeWeight: 4
          }}
        />
      ) : null}
      {savedroutepath.routePath.length != 0? (
        <Polyline
          draggable={false}
          editable={false}
          path={savedroutepath.routePath}
          options={{
            fillColor: "transparent",
            strokeColor: savedroutepath.status? "lime" : "red",
            strokeWeight: 4
          }}
        />
      ) : null}
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
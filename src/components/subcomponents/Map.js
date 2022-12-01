import React, { useState, useEffect } from 'react'
import MainIndex from '../maincomponents/MainIndex'
import './../../styles/subcomponents/Map.css'
import MapIcon from '@material-ui/icons/Map'
import InfoIcon from '@material-ui/icons/Info'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import Axios from 'axios'
import { SET_BUS_STOPS_LIST, SET_MAP_MODE, SET_ROUTE_MAKER_LIST, SET_ROUTE_PATH, SET_ROUTE_STATUS_LOADER } from '../../redux/types'
import { URL } from '../../json/urlconfig'

function Map() {

  const busstopslist = useSelector(state => state.busstopslist);
  const mapmode = useSelector(state => state.mapmode);
  const routemakerlist = useSelector(state => state.routemakerlist);
  const routepath = useSelector(state => state.routepath);
  const routestatusloader = useSelector(state => state.routestatusloader);

  let routepathholder = [];
  let routepathdeconstruct = [];
  let routepathdeconstructlocation = [];

  const [menutrigger, setmenutrigger] = useState(false)

  const dispatch = useDispatch()

  let cancelAxios;

  useEffect(() => {

    initBusStopsData()

    return () => {
        cancelAxios.cancel();
    }
  },[])

  const initBusStopsData = () => {
    Axios.get(`${URL}/company/enabledBusStops`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result);
        dispatch({ type: SET_BUS_STOPS_LIST, busstopslist: response.data.result })
        subscribeBusStopData()
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const subscribeBusStopData = () => {
    cancelAxios = undefined
    if(typeof cancelAxios != typeof undefined){
        cancelAxios.cancel()
        subscribeBusStopData()
    }
    else
    {
        cancelAxios = Axios.CancelToken.source()
        Axios.get(`${URL}/admin/busStopsDataSubscribe`, {
          headers:{
            "x-access-token": localStorage.getItem("token"),
            "Access-Control-Allow-Origin": "*"
          },
          cancelToken: cancelAxios.token
        }).then((response) => {
          if(response.data.status){
            //run init commands
            // console.log(response.data.result.message)
            cancelAxios = undefined
            initBusStopsData()
          }
          else{
            //also run init commands
            // cancelAxios()
            // subscribeMessages()
            initBusStopsData()
          }
        }).catch((err) => {
          // cancelAxios()
          // subscribeMessages()
          if(err.message != 'canceled'){
            cancelAxios = undefined;
            subscribeBusStopData()
            // initBusStopsData()
            // console.log(err)
          }
          // console.log(err)
        })
    }
  }

  const routeCallAPI = () => {
    if(mapmode == "routes"){
      let pendingCoordinates = []
      let paringCoordinates = []

      routemakerlist.map((rtlst, i) => {
        if(i != 0){
          paringCoordinates.push([
            // routemakerlist[i - 1].pendingID,
            routemakerlist[i - 1].coordinates,
            // rtlst.pendingID,
            rtlst.coordinates
          ])
        }
        pendingCoordinates.push(rtlst.coordinates)

        if(routemakerlist.length - 1 == i){
          // console.log(paringCoordinates)
          // paringCoordinates.map((mps, i) => {
          //   // setTimeout(() => {
          //   //   directionsAPI(mps[0][0],mps[0][1],mps[1][0],mps[1][1])
          //   // }, 15000)
          //   setTimeout(() => {
          //     factoryFunc(mps[0][0],mps[0][1],mps[1][0],mps[1][1])
          //   },5000)
          //   // console.log(`${mps[0][0]} | ${mps[0][1]} || ${mps[1][0]} | ${mps[1][1]}`)
          // })
          directionsAPI(paringCoordinates, 0, pendingCoordinates.length - 1)
          dispatch({ type: SET_ROUTE_STATUS_LOADER, routestatusloader: { loading: true, percentage: 0 } })
          // console.log(paringCoordinates)
        }
      })
    }
  }

  const factoryFunc = (long1, lat1, long2, lat2) => {
    setTimeout(() => {
      directionsAPI(long1, lat1, long2, lat2)
    }, 5000)
  }

  const directionsAPI = (arraydata, currentIndex, arraylength) => {
    let indexCounter = currentIndex + 1;
    let long1 = arraydata[currentIndex][0][0]
    let lat1 = arraydata[currentIndex][0][1]
    let long2 = arraydata[currentIndex][1][0]
    let lat2 = arraydata[currentIndex][1][1]

    setTimeout(() => {
      Axios.get(`https://us1.locationiq.com/v1/directions/driving/${long1},${lat1};${long2},${lat2}?key=pk.2dd9b328ed0803c41448fc0c3ba30cd4&steps=true&alternatives=true&geometries=polyline&overview=full`)
      .then((response) => {
        // console.log(response.data);
        // setcenterMap({ lat: parseFloat(response.data.lat), lng: parseFloat(response.data.lon) })
        // console.log(`${currentIndex} | ${indexCounter} | ${arraylength}`)
        dispatch({ type: SET_ROUTE_STATUS_LOADER, routestatusloader: { loading: true, percentage: indexCounter / arraylength * 100 } })
        // console.log(response.data)
        // console.log(response.data.routes[0].legs[0])
        // dispatch({ type: SET_ROUTE_PATH, routepath: [
        //   ...routepath,
        //   ...response.data.routes[0].legs[0].steps
        // ] })
        routepathholder.push(...response.data.routes[0].legs[0].steps);

        if(indexCounter != arraylength){
          directionsAPI(arraydata, indexCounter, arraylength)
        }
        else{
          routepathholder.map((data, i) => {
            routepathdeconstruct.push(...data.intersections)
          })

          routepathdeconstruct.map((data, i) => {
            routepathdeconstructlocation.push({lng: parseFloat(data.location[0]), lat: parseFloat(data.location[1])})
          })

          setTimeout(() => {
            // console.log(routepathdeconstructlocation)
            dispatch({ type: SET_ROUTE_PATH, routepath: routepathdeconstructlocation })
            dispatch({ type: SET_ROUTE_STATUS_LOADER, routestatusloader: { loading: false, percentage: 0 } })
          },2000)
          // console.log("Done")
          dispatch({ type: SET_ROUTE_STATUS_LOADER, routestatusloader: { loading: true, percentage: indexCounter / arraylength * 100 } })
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
    }, 5000)
  }

  const clearPendingRouteData = () => {
    dispatch({ type: SET_ROUTE_MAKER_LIST, routemakerlist: [] })
    dispatch({ type: SET_ROUTE_PATH, routepath: [] })
  }

  return (
    <div id='div_map'>
      <div id='div_map_header'>
          <div id='div_iconheader_holder'>
            <MapIcon />
            <p>Welcome | Map Management</p>
          </div>
          <div id='info_div'>
            <button id='btn_info' onClick={() => { setmenutrigger(!menutrigger) }}><MenuIcon /></button>
          </div>
      </div>
      <motion.div
        animate={{
          marginLeft: menutrigger? "10px" : "-240px"
        }}
        id='div_menu_options' className='absolute_divs_map'>
          <nav id='nav_menu_options'>
            <li>
              <p id='menu_label'>Menu</p>
            </li>
            <li>
              <div id='div_menu_btns'>
                <button className='btn_menu_navigations'>Live Map</button>
                {/* <button className='btn_menu_navigations'>Bus Stops</button> */}
                <button className='btn_menu_navigations' onClick={() => { dispatch({ type: SET_MAP_MODE, mapmode: "routes" }) }}>Routes</button>
                <button className='btn_menu_navigations'>Traffic</button>
              </div>
            </li>
          </nav>
        </motion.div>
        <motion.div
        animate={{
          right: mapmode == "routes"? "10px" : "-470px"
        }}
        id='div_routes_window' className='absolute_divs_map'>
          <div id='div_routes_window_header'>
            <div id='p_routes_window_label'>
              <span className='span_inside_routes_window_label'>Routes | </span>
              {routestatusloader.loading? (
                <>
                  <span className='span_inside_routes_window_label'>
                    <div id='div_outside_bar'>
                      {/* <span id='span_status_loader'>Hello</span> */}
                      <motion.div
                      animate={{
                        width: `${routestatusloader.percentage}%`,
                        transition:{
                          bounce: 0,
                          duration: 0.5
                        }
                      }}
                      id='div_inside_bar'>&#8203;</motion.div>
                    </div>
                  </span>
                  <span id='span_status_loader'>...Generating Route Preview</span>
                </>
              ) : (
                <span id='span_status_loader'>No Actions</span>
              )}
            </div>
            <button id='btn_bus_stops_close' onClick={() => { dispatch({ type: SET_MAP_MODE, mapmode: "none" }) }}><CloseIcon /></button>            
          </div>
          <div id='div_routes_window_sections_holder'>
            <div className='div_routes_window_sections'>
              <div id='div_bus_stops_list'>
                    <div id='div_bus_stops_list_container'>
                      <table id='tbl_bus_stops_list'>
                        <tbody>
                          <tr id='tr_header_bus_stops_list'>
                            <th className='th_header_bus_stops_list'>Route ID</th>
                            <th className='th_header_bus_stops_list'>Route Name</th>
                          </tr>
                          <tr className='tr_content_bus_stops_list'>
                              <td>Hello</td>
                              <td>World</td>
                          </tr>
                          {/* {busstopslist.map((list, i) => {
                            return(
                              <tr onClick={() => {
                                dispatch({ type: SET_CENTER_MAP, centermap: { lat: parseFloat(list.coordinates.latitude), lng: parseFloat(list.coordinates.longitude) }})
                                dispatch({ type: SET_SELECTED_MARKER, selectedmarker: list.busStopID })
                              }} key={i} className='tr_content_bus_stops_list'>
                                <td>{list.busStopID}</td>
                                <td>{list.stationName}</td>
                              </tr>
                            )
                          })} */}
                        </tbody>
                      </table>
                    </div>
                  </div>
            </div>
            <div className='div_routes_window_sections'>
              <div id='div_create_route_header'>
                <p id='p_create_route_label'>Create Route</p>
              </div>
              <div id='div_create_route_form'>
                <p id='p_create_route_name_label'>Route Name</p>
                <input type='text' id='input_create_route_name' className='inputs_create_route_classifier' placeholder='Type Route Name' />
              </div>
              <div id='div_route_list_container'>
                <p id='p_route_list_label'>Pending Coordinates</p>
                <div id='div_pending_route_list'>
                  <table id='tbl_pending_route_list'>
                    <tbody>
                      <tr>
                        <th className='th_pending_route_list'>Station Name</th>
                        <th className='th_pending_route_list'>Coordinates</th>
                      </tr>
                      {
                        routemakerlist.map((rts, i) => {
                          return(
                            <tr key={i} className='tr_content_bus_stops_list' onClick={() => {
                              // console.log(routemakerlist.filter(item => rts.pendingID != item.pendingID))
                              dispatch({ type: SET_ROUTE_MAKER_LIST, routemakerlist: routemakerlist.filter(item => rts.pendingID != item.pendingID) })
                            }}>
                              <td className='td_content_route_indv'>{rts.stationName}</td>
                              <td className='td_content_route_indv'>
                                <span>{rts.coordinates[0]}</span>
                                <span>{rts.coordinates[1]}</span>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              <div id='div_navigations_create_route'>
                <button className='btns_navigations_create_route' onClick={() => { routeCallAPI() }}>Preview Route</button>
                <button className='btns_navigations_create_route'>Save Route</button>
                <button className='btns_navigations_create_route' onClick={() => { clearPendingRouteData() }}>Clear</button>
              </div>
            </div>
          </div>
        </motion.div>
      <MainIndex />
    </div>
  )
}

export default Map
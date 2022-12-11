import React, { useState, useEffect } from 'react'
import MainIndex from '../maincomponents/MainIndex'
import './../../styles/subcomponents/Map.css'
import MapIcon from '@material-ui/icons/Map'
import InfoIcon from '@material-ui/icons/Info'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import StationIconDefault from '@material-ui/icons/Storefront'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import Axios from 'axios'
import { SET_BUS_STOPS_LIST, SET_BUS_STOP_INFO, SET_MAP_MODE, SET_PUBLIC_ROUTE_LIST, SET_ROUTE_LIST, SET_ROUTE_MAKER_LIST, SET_ROUTE_PATH, SET_ROUTE_STATUS_LOADER, SET_SAVED_ROUTE_PATH, SET_SELECTED_MARKER } from '../../redux/types'
import { URL } from '../../json/urlconfig'
import { savedroutepathState } from '../../redux/actions'

function Map() {

  const busstopslist = useSelector(state => state.busstopslist);
  const mapmode = useSelector(state => state.mapmode);
  const routemakerlist = useSelector(state => state.routemakerlist);
  const routepath = useSelector(state => state.routepath);
  const routestatusloader = useSelector(state => state.routestatusloader);
  const routelist = useSelector(state => state.routelist)
  const publicroutelist = useSelector(state => state.publicroutelist)
  const authdetails = useSelector(state => state.authdetails);
  const savedroutepath = useSelector(state => state.savedroutepath);
  const busstopinfo = useSelector(state => state.busstopinfo);

  let routepathholder = [];
  let routepathdeconstruct = [];
  let routepathdeconstructlocation = [];

  const [menutrigger, setmenutrigger] = useState(false)
  const [routename, setroutename] = useState("");
  const [routePrivacy, setroutePrivacy] = useState(false);

  const dispatch = useDispatch()

  let cancelAxios;

  useEffect(() => {

    initBusStopsData()
    initRoutesList()
    initPublicRoutesList()

    return () => {
        cancelAxios.cancel();
        dispatch({ type: SET_SAVED_ROUTE_PATH, savedroutepath: savedroutepathState })
        dispatch({ type: SET_MAP_MODE, mapmode: "none"})
        dispatch({ type: SET_BUS_STOP_INFO, busstopinfo: null })
    }
  },[])

  const initRoutesList = () => {
    Axios.get(`${URL}/company/routesList/${authdetails.companyID}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result)
        dispatch({ type: SET_ROUTE_LIST, routelist: response.data.result })
      }
      else{
        console.log(response.data.result.message)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const initPublicRoutesList = () => {
    Axios.get(`${URL}/company/publicRouteList`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result)
        dispatch({ type: SET_PUBLIC_ROUTE_LIST, publicroutelist: response.data.result })
      }
      else{
        console.log(response.data.result.message)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

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
      if(routemakerlist.length > 1){
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
      else{
        alert("Please add 2 or more stations");
      }
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
    setroutename("");
  }

  const saveRoute = () => {
    if(routename == ""){
      alert("Please input a name for the route")
    }
    else{
      // console.log(routemakerlist)
      if(routemakerlist.length > 1){
        if(routepath.length > 1){
          Axios.post(`${URL}/company/createRoute`, {
            routeName: routename,
            stationList: routemakerlist,
            routePath: routepath,
            companyID: authdetails.companyID,
            privacy: routePrivacy
          },{
            headers:{
              "x-access-token": localStorage.getItem("token")
            }
          }).then((response) => {
            if(response.data.status){
              console.log(response.data.result.message)
              clearPendingRouteData()
              initRoutesList()
              initPublicRoutesList()
              setroutePrivacy(false);
            }
            else{
              console.log(response.data.result.message)
            }
          }).catch((err) => {
            console.log(err);
          })
        }
        else{
          alert("Click first Preview Route to scan the Route Path")
        }
      }
      else{
        alert("Please add 2 or more stations")
      }
    }
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
        right: savedroutepath.routeID != null? "10px" : "-470px"
      }}
      id='div_routes_info' className='absolute_divs_map'>
        <div id='div_route_info_header'>
          <p id='p_route_info_label'>Route Info - {savedroutepath.routeID}</p>
          <button id='btn_route_info_close' onClick={() => { dispatch({ type: SET_SAVED_ROUTE_PATH, savedroutepath: savedroutepathState }) }}><CloseIcon /></button>
        </div>
        <div id='div_route_info_data_section'>
          <div className='div_indv_sections'>
            <p id='p_enlisted_bus_stops_label'>Bus Stops in Route</p>
            <div id='div_table_conatiner_holder'>
              <table id='tbl_enlisted_bus_stops_container'>
                <tbody>
                  <tr>
                    <th className='th_label_header'>BS ID</th>
                    <th className='th_label_header'>Station Name</th>
                  </tr>
                  {savedroutepath.stationList.map((list, i) => {
                    return(
                      <tr onClick={() => { dispatch({ type: SET_SELECTED_MARKER, selectedmarker: list.stationID}); dispatch({ type: SET_BUS_STOP_INFO, busstopinfo: null }) }} key={i} className='tr_content_bus_stops_list'>
                        <td>{list.stationID}</td>
                        <td>{list.stationName}</td>
                      </tr>
                      )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className='div_indv_sections'>
            <p id='p_route_name_label'>{savedroutepath.routeName}</p>
            <div id='div_route_info_details'>
              <p id='p_details_label'>Details</p>
              <div id='div_details_data_dynamic_container'>
                <p className='p_details_data_holder'>{savedroutepath.routeID}</p>
                <p className='p_details_data_holder'>{savedroutepath.stationList.length} included Bus Stops</p>
                <p className='p_details_data_holder'>Data from {savedroutepath.companyID}</p>
              </div>
            </div>
            <div id='div_route_info_details'>
              <p id='p_details_label'>Status</p>
              <div id='div_details_data_dynamic_container'>
                <p className='p_details_data_holder'>{savedroutepath.privacy? "Route is in Public" : "Route is Private"}</p>
                <p className='p_details_data_holder'>{savedroutepath.status? "Activated" : "Not Active"}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
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
                <button className='btn_menu_navigations' onClick={() => { dispatch({ type: SET_MAP_MODE, mapmode: "bus_stops" }) }}>Bus Stops</button>
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
              <p className='p_routes_list_indicator_label'>Company Routes</p>
              <div id='div_bus_stops_list_container'>
                      <table id='tbl_bus_stops_list'>
                        <tbody>
                          <tr id='tr_header_bus_stops_list'>
                            <th className='th_header_bus_stops_list'>Route ID</th>
                            <th className='th_header_bus_stops_list'>Route Name</th>
                          </tr>
                          {routelist.map((list, i) => {
                            return(
                              <tr onClick={() => { 
                                  dispatch({ type: SET_SAVED_ROUTE_PATH, savedroutepath: {
                                      routeID: list.routeID,
                                      routeName: list.routeName,
                                      stationList: list.stationList,
                                      routePath: list.routePath,
                                      companyID: list.companyID,
                                      privacy: list.privacy,
                                      status: list.status
                                  } })
                               }} key={i} className='tr_content_bus_stops_list'>
                                <td>{list.routeID}</td>
                                <td>{list.routeName}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                  </div>
                  <p className='p_routes_list_indicator_label'>Public Routes</p>
                  <div id='div_bus_stops_list_container'>
                      <table id='tbl_bus_stops_list'>
                        <tbody>
                          <tr id='tr_header_bus_stops_list'>
                            <th className='th_header_bus_stops_list'>Route ID</th>
                            <th className='th_header_bus_stops_list'>Route Name</th>
                          </tr>
                          {publicroutelist.map((list, i) => {
                            return(
                              <tr onClick={() => { 
                                  dispatch({ type: SET_SAVED_ROUTE_PATH, savedroutepath: {
                                      routeID: list.routeID,
                                      routeName: list.routeName,
                                      stationList: list.stationList,
                                      routePath: list.routePath,
                                      companyID: list.companyID,
                                      privacy: list.privacy,
                                      status: list.status
                                  } })
                               }} key={i} className='tr_content_bus_stops_list'>
                                <td>{list.routeID}</td>
                                <td>{list.routeName}</td>
                              </tr>
                            )
                          })}
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
                <input type='text' id='input_create_route_name' value={routename} onChange={(e) => { setroutename(e.target.value) }} className='inputs_create_route_classifier' placeholder='Type Route Name' />
              </div>
              <div id='div_route_privacy'>
                <p id='p_label_route_privacy'>Route Privacy - {routePrivacy? "Public" : "Private"}</p>
                <div id='div_checker_route_privacy'>
                  <span>
                    <div class="container">
                      <label class="switch" for="checkbox">
                        <input type="checkbox" id="checkbox" checked={routePrivacy} onChange={(e) => { setroutePrivacy(e.target.checked) }}/>
                        <div class="slider round"></div>
                      </label>
                    </div>
                  </span>
                  <span>
                    <p id='p_note_route_privacy'>Allow other companies / operators see your route.</p>
                  </span>
                </div>
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
                <button className='btns_navigations_create_route' onClick={() => { saveRoute() }}>Save Route</button>
                <button className='btns_navigations_create_route' onClick={() => { clearPendingRouteData() }}>Clear</button>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
        animate={{
          right: mapmode == "bus_stops"? "10px" : "-470px"
        }}
        id='div_routes_window' className='absolute_divs_map'>
          <div id='div_routes_window_header'>
            <div id='p_routes_window_label'>
              <span className='span_inside_routes_window_label'>Bus Stops Menu</span>
            </div>
            <button id='btn_bus_stops_close' onClick={() => { dispatch({ type: SET_MAP_MODE, mapmode: "none" }); dispatch({ type: SET_BUS_STOP_INFO, busstopinfo: null }) }}><CloseIcon /></button>            
          </div>
          <div id='div_routes_window_sections_holder'>
            <div className='div_routes_window_sections'>
              <div id='div_bus_stops_list'>
                <div id='div_table_conatiner_holder'>
                  <table id='tbl_enlisted_bus_stops_container'>
                    <tbody>
                      <tr>
                        <th className='th_label_header'>BS ID</th>
                        <th className='th_label_header'>Station Name</th>
                      </tr>
                      {busstopslist.map((list, i) => {
                        return(
                          <tr onClick={() => { dispatch({ type: SET_SELECTED_MARKER, selectedmarker: list.busStopID}); dispatch({ type: SET_BUS_STOP_INFO, busstopinfo: null }) }} key={i} className='tr_content_bus_stops_list'>
                            <td>{list.busStopID}</td>
                            <td>{list.stationName}</td>
                          </tr>
                          )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className='div_routes_window_sections'>
              {busstopinfo != null? (
                <div id='div_bus_stop_details_present'>
                  <p id='p_create_route_label'>Bus Stop Details</p>
                  <div id='div_bus_stop_basics'>
                    <p className='p_details_basic'>{busstopinfo.stationName}</p>
                    <p className='p_details_basic'>{busstopinfo.busStopID}</p>
                    <p className='p_details_basic'>{busstopinfo.stationAddress}</p>
                  </div>
                  <div id='div_bus_stop_basics'>
                    <p className='p_details_coordinates'>Coordinates</p>
                    <p className='p_details_coordinates'>Lng: {busstopinfo.coordinates.longitude}</p>
                    <p className='p_details_coordinates'>Lat: {busstopinfo.coordinates.latitude}</p>
                  </div>
                </div>
              ) : (
                <div id='div_bus_stop_details'>
                  <StationIconDefault style={{fontSize: "70px", color: "grey"}} />
                  <p id='p_bus_stop_details_default_label'>Select a station</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      <MainIndex />
    </div>
  )
}

export default Map
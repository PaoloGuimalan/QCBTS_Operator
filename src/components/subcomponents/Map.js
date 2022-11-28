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
import { SET_BUS_STOPS_LIST } from '../../redux/types'
import { URL } from '../../json/urlconfig'

function Map() {

  const busstopslist = useSelector(state => state.busstopslist);

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
                <button className='btn_menu_navigations'>Routes</button>
                <button className='btn_menu_navigations'>Traffic</button>
              </div>
            </li>
          </nav>
        </motion.div>
      <MainIndex />
    </div>
  )
}

export default Map
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../../styles/maincomponents/Home.css'
import Axios from 'axios';
import { URL } from '../../json/urlconfig';
import { SET_AUTH_DETAILS, SET_COMPANY_DETAILS } from '../../redux/types';
import { authDetailsState, companyDetailsState } from '../../redux/actions';
import LogoutIcon from '@material-ui/icons/ExitToApp'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@material-ui/icons/Dashboard'
import MapIcon from '@material-ui/icons/Map'
import MessagesIcon from '@material-ui/icons/Message'
import DriverIcon from '@material-ui/icons/EmojiPeople'
import BusIcon from '@material-ui/icons/DirectionsBus'
import AccountIcon from '@material-ui/icons/AccountCircle'
import { motion } from 'framer-motion'
import Dashboard from '../subcomponents/Dashboard';
import Messages from '../subcomponents/Messages';
import Map from '../subcomponents/Map';
import DriversAccount from '../subcomponents/DriversAccount';
import BusManagement from '../subcomponents/BusManagement';
import Account from '../subcomponents/Account';

function Home() {

  const authdetails = useSelector(state => state.authdetails)
  const companydetails = useSelector(state => state.companydetails)
  const path = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [navstate, setnavstate] = useState("home")

  useEffect(() => {
    getCompanyData()

    return () => {
      dispatch({ type: SET_COMPANY_DETAILS, companydetails: companyDetailsState })
    }

  },[authdetails]);

  useEffect(() => {
    if(path.pathname.split("/")[2] == undefined){
      setnavstate("home")
    }
    else{
      setnavstate(path.pathname.split("/")[2])
    }
    // console.log(path.pathname.split("/")[2])
  },[path])

  const getCompanyData = () => {
    if(authdetails.companyID != ""){
      Axios.get(`${URL}/company/data/${authdetails.companyID}`, {
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          dispatch({ type: SET_COMPANY_DETAILS, companydetails: response.data.result })
          // console.log(response.data.result)
        }
        else{
          console.log(response.data.result.message)
        }
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  const logoutProcess = () => {
    localStorage.removeItem("token");
    dispatch({ type: SET_AUTH_DETAILS, authdetails:{
      ...authDetailsState,
      status: false
  } })
    navigate("/login")
  }

  return (
    <div id='div_home'>
      <div id='div_home_navigations'>
        <div id='div_home_label'>
          <p className='p_home_labels'>Bus Track</p>
          <p className='p_home_labels'>{companydetails.companyName}</p>
        </div>
        <div id='div_navigations_btns'>
          <Link to='/home' className='link_styler'>
            <motion.div
            animate={{
              color: navstate == "home"? "#EBA400" : "white"
            }} 
            className='div_icon_labels_link'>
              <DashboardIcon style={{fontSize: "22px"}} />
              <span>Dashboard</span>
            </motion.div>
          </Link>
          <Link to='/home/messages' className='link_styler'>
            <motion.div
            animate={{
              color: navstate == "messages"? "#EBA400" : "white"
            }} 
            className='div_icon_labels_link'>
              <MessagesIcon style={{fontSize: "22px"}} />
              <span>Messages</span>
            </motion.div>
          </Link>
          <Link to='/home/map' className='link_styler'>
            <motion.div
            animate={{
              color: navstate == "map"? "#EBA400" : "white"
            }} 
            className='div_icon_labels_link'>
              <MapIcon style={{fontSize: "22px"}} />
              <span>Map Management</span>
            </motion.div>
          </Link>
          <Link to='/home/da' className='link_styler'>
            <motion.div
            animate={{
              color: navstate == "da"? "#EBA400" : "white"
            }} 
            className='div_icon_labels_link'>
              <DriverIcon style={{fontSize: "22px"}} />
              <span>Drivers Account</span>
            </motion.div>
          </Link>
          <Link to='/home/buses' className='link_styler'>
            <motion.div
            animate={{
              color: navstate == "buses"? "#EBA400" : "white"
            }} 
            className='div_icon_labels_link'>
              <BusIcon style={{fontSize: "22px"}} />
              <span>Bus Management</span>
            </motion.div>
          </Link>
          <Link to='/home/account' className='link_styler'>
            <motion.div
            animate={{
              color: navstate == "account"? "#EBA400" : "white"
            }} 
            className='div_icon_labels_link'>
              <AccountIcon style={{fontSize: "22px"}} />
              <span>Account</span>
            </motion.div>
          </Link>
        </div>
        <div id='div_navigations_flexed'></div>
        <div id='div_logout_btn_container'>
          <button id='btn_logout' onClick={() => { logoutProcess() }}><LogoutIcon style={{fontSize: "20px"}} /> Logout</button>
        </div>
      </div>
      <div id='div_home_flexed_container'>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/messages/*' element={<Messages />} />
          <Route path='/map/*' element={<Map />} />
          <Route path='/da/*' element={<DriversAccount />} />
          <Route path='/buses/*' element={<BusManagement />} />
          <Route path='/account/*' element={<Account />} />
        </Routes>
      </div>
    </div>
  )
}

export default Home
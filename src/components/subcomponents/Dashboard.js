import React from 'react'
import './../../styles/subcomponents/Dashboard.css'
import DashboardIcon from '@material-ui/icons/Dashboard'
import { useDispatch, useSelector } from 'react-redux'
import WelcomeHeaderIcon from './../../resources/imgs/iconimg.png'
import MessageIcon from '@material-ui/icons/QuestionAnswerOutlined'
import { useNavigate } from 'react-router-dom'
import DriverIcon from '@material-ui/icons/AirlineSeatReclineNormal'
import BusIcon from '@material-ui/icons/DirectionsBus'
import MainIndex from '../maincomponents/MainIndex'

function Dashboard() {

  const authdetails = useSelector(state => state.authdetails)
  const companydetails = useSelector(state => state.companydetails)

  const navigate = useNavigate();

  return (
    <div id='div_dashboard'>
      <div id='div_dashboard_header'>
        <p id='p_tag_dashboard'><DashboardIcon /> Dashboard</p>
        <p id='p_adminname'>{authdetails.fullname} <div id='div_adminicon'>{authdetails.fullname.split("")[0]}</div></p>
      </div>
      <div id='div_welcome_label'>
        <img src={WelcomeHeaderIcon} id='img_welcome_icon' />
        <div id='div_welcome_admin_label'>
          <p className='p_welcome_admin_label'>Welcome, {authdetails.fullname.split(" ")[0]}</p>
          <p className='p_welcome_admin_label'>Here are the updates for today</p>
        </div>
        <div id='div_flexed'/>
        <button id='btn_msgicon' onClick={() => {
          navigate("/home/messages")
        }}><MessageIcon style={{fontSize: "30px", color: "#2F2F2F"}} /></button>
      </div>
      <div id='div_mini_stats'>
        <div className='div_mini_stats_section'>
          <div className='div_mini_stats_sub_one'>
            <div className='div_mini_stats_info'>
              <DriverIcon style={{fontSize: "35px"}} />
            </div>
            <div className='div_mini_stats_info'>
              <p className='p_info_stats'>20</p>
              <p className='p_info_stats'>Drivers Online</p>
            </div>
          </div>
          <div className='div_mini_stats_sub_one'>
            <div className='div_mini_stats_info'>
              <BusIcon style={{fontSize: "35px"}} />
            </div>
            <div className='div_mini_stats_info'>
              <p className='p_info_stats'>20</p>
              <p className='p_info_stats'>Confirmed Buses</p>
            </div>
          </div>
        </div>
        <div className='div_mini_stats_section'>
          <p>Hello</p>
        </div>
        <div className='div_mini_stats_section'>
          <MainIndex />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
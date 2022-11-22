import React, { useState } from 'react'
import './../../styles/subcomponents/Dashboard.css'
import DashboardIcon from '@material-ui/icons/Dashboard'
import { useDispatch, useSelector } from 'react-redux'
import WelcomeHeaderIcon from './../../resources/imgs/iconimg.png'
import MessageIcon from '@material-ui/icons/QuestionAnswerOutlined'
import { useNavigate } from 'react-router-dom'
import DriverIcon from '@material-ui/icons/AirlineSeatReclineNormal'
import BusIcon from '@material-ui/icons/DirectionsBus'
import MainIndex from '../maincomponents/MainIndex'
import StarIcon from '@material-ui/icons/Star'
import StarIconEmpty from '@material-ui/icons/StarOutline'
import LocationIcon from '@material-ui/icons/LocationOn'
import SearchIcon from '@material-ui/icons/Search'

function Dashboard() {

  const authdetails = useSelector(state => state.authdetails)
  const companydetails = useSelector(state => state.companydetails)

  const navigate = useNavigate();

  const [resultsFilter, setresultsFilter] = useState("All");

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
          <div id='div_mini_stats_rating'>
            <div id='div_rating_header'>
              <p className='p_rating_label'>Average User Rating</p>
              <p className='p_rating_label'>4.3 / 5</p>
            </div>
            <div id='div_rating_stars'>
              <StarIcon style={{fontSize: "30px", color: "#E8AF1D"}} />
              <StarIcon style={{fontSize: "30px", color: "#E8AF1D"}} />
              <StarIcon style={{fontSize: "30px", color: "#E8AF1D"}} />
              <StarIcon style={{fontSize: "30px", color: "#9B9B9B"}} />
              <StarIcon style={{fontSize: "30px", color: "#9B9B9B"}} />
            </div>
            <div id='div_rating_bar_holder'>
              <div className='div_rating_bar'>
                <span className='span_star_icon_label'>5<StarIcon style={{fontSize: "10px", color: "#9B9B9B"}} /></span>
                <span className='span_rating_bar'>
                  <span className='span_rating_inside_bar' style={{width: "60%"}} ></span>
                </span>
              </div>
              <div className='div_rating_bar'>
                <span className='span_star_icon_label'>4<StarIcon style={{fontSize: "10px", color: "#9B9B9B"}} /></span>
                <span className='span_rating_bar'>
                  <span className='span_rating_inside_bar' style={{width: "20%"}} ></span>
                </span>
              </div>
              <div className='div_rating_bar'>
                <span className='span_star_icon_label'>3<StarIcon style={{fontSize: "10px", color: "#9B9B9B"}} /></span>
                <span className='span_rating_bar'>
                  <span className='span_rating_inside_bar' style={{width: "10%"}} ></span>
                </span>
              </div>
              <div className='div_rating_bar'>
                <span className='span_star_icon_label'>2<StarIcon style={{fontSize: "10px", color: "#9B9B9B"}} /></span>
                <span className='span_rating_bar'>
                  <span className='span_rating_inside_bar' style={{width: "5%"}} ></span>
                </span>
              </div>
              <div className='div_rating_bar'>
                <span className='span_star_icon_label'>1<StarIcon style={{fontSize: "10px", color: "#9B9B9B"}} /></span>
                <span className='span_rating_bar'>
                  <span className='span_rating_inside_bar' style={{width: "5%"}} ></span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='div_mini_stats_section'>
          <div id='div_map_clickable_label' onClick={() => { navigate("/home/map") }}><LocationIcon style={{fontSize: "20px"}} /> View Live Tracking</div>
          <MainIndex />
        </div>
      </div>
      <div id='div_activities_section'>
        <div id='div_activities_section_main'>
          <div id='div_activities_header'>
            <p id='p_activities_label'>Activity</p>
            <div id='span_search_activities_container'>
              <input id='input_search_activities' placeholder='Search Activities' />
              <button id='btn_search_activities'><SearchIcon /></button>
            </div>
          </div>
          <div id='div_results_nav'>
            <button className='btns_results_nav' style={{fontWeight: resultsFilter == "All"? "bold" : "normal"}} onClick={() => { setresultsFilter("All") }}>All</button>
            <button className='btns_results_nav' style={{fontWeight: resultsFilter == "Recent"? "bold" : "normal"}} onClick={() => { setresultsFilter("Recent") }}>Recent</button>
          </div>
          <div id='div_results_holder'>
            <p>No Recent Activities</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
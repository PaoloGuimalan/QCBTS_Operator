import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../../styles/maincomponents/Home.css'
import Axios from 'axios';
import { URL } from '../../json/urlconfig';
import { SET_AUTH_DETAILS, SET_COMPANY_DETAILS } from '../../redux/types';
import { authDetailsState, companyDetailsState } from '../../redux/actions';
import LogoutIcon from '@material-ui/icons/ExitToApp'
import { useNavigate } from 'react-router-dom';

function Home() {

  const authdetails = useSelector(state => state.authdetails)
  const companydetails = useSelector(state => state.companydetails)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    getCompanyData()

    return () => {
      dispatch({ type: SET_COMPANY_DETAILS, companydetails: companyDetailsState })
    }

  },[authdetails]);

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
        <div>
          <p style={{fontSize: "13px", color: "white"}}>Navigation Buttons Section</p>
        </div>
        <div id='div_navigations_flexed'></div>
        <div id='div_logout_btn_container'>
          <button id='btn_logout' onClick={() => { logoutProcess() }}><LogoutIcon style={{fontSize: "20px"}} /> Logout</button>
        </div>
      </div>
      <div id='div_home_flexed_container'>
        Home: {JSON.stringify(authdetails)}
      </div>
    </div>
  )
}

export default Home
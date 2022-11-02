import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { URL } from '../../json/urlconfig'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SET_AUTH_DETAILS } from '../../redux/types';
import { authDetailsState } from '../../redux/actions';
import '../../styles/authcomponents/Login.css'

function Login() {

  const [companyAdminID, setcompanyAdminID] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const btnLogin = () => {
    if(companyAdminID.trim().length != 0 && password.trim().length != 0){
        Axios.post(`${URL}/auth/logincompany`,{
            companyAdminID: companyAdminID,
            password: password
        }).then((response) => {
            if(response.data.status){
                setcompanyAdminID("")
                setpassword("")
                // console.log(response.data.result)
                localStorage.setItem('token', response.data.result.token)
                dispatch({ type: SET_AUTH_DETAILS, authdetails:{
                    companyID: response.data.result.companyID,
                    userID: response.data.result.companyAdminID,
                    fullname: response.data.result.companyAdminName,
                    email: response.data.result.companyAdminEmail,
                    status: true
                } })
            }
            else{
                // console.log(response.data.result)
                dispatch({ type: SET_AUTH_DETAILS, authdetails:{
                    ...authDetailsState,
                    status: false
                } })
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    else{
        alert("Please fill all fields")
    }
  }

  return (
    <div id='div_login'>
        <div id='div_flexed_login'></div>
        <div id='div_form_login'>
            <div className='div_form_indvs'>
                <p id='p_label_login'>Welcome, Company Admin!</p>
                <p id='p_sublabel_login'>Enter credentials below to login</p>
            </div>
            <div className='div_form_indvs'>
                <input type='text' placeholder='Company ID' value={companyAdminID} onChange={(e) => { setcompanyAdminID(e.target.value) }} id='companyAdminID' name='companyAdminID' className='login_inputs' />
                <input type='password' placeholder='Password' value={password} onChange={(e) => { setpassword(e.target.value) }} id='password' name='password' className='login_inputs' />
                <button id='btn_login' onClick={() => { btnLogin() }}>Login</button>
                <div id='div_flexed_under_forms'></div>
            </div>
        </div>
    </div>
  )
}

export default Login
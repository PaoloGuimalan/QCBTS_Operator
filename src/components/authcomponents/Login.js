import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { URL } from '../../json/urlconfig'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SET_AUTH_DETAILS } from '../../redux/types';
import { authDetailsState } from '../../redux/actions';

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
    <div>
        <p>Login</p>
        <input type='text' placeholder='Company ID' value={companyAdminID} onChange={(e) => { setcompanyAdminID(e.target.value) }} id='companyAdminID' name='companyAdminID' />
        <input type='password' placeholder='Password' value={password} onChange={(e) => { setpassword(e.target.value) }} id='password' name='password' />
        <button onClick={() => { btnLogin() }}>Login</button>
    </div>
  )
}

export default Login
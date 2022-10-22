import logo from './logo.svg';
import './App.css';
import Login from './components/authcomponents/Login';
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/maincomponents/Home';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { SET_AUTH_DETAILS } from './redux/types';
import { authDetailsState } from './redux/actions';
import Axios from 'axios';
import { URL } from './json/urlconfig';

function App() {

  const authdetails = useSelector(state => state.authdetails);
  const token = localStorage.getItem("token")
  const dispatch = useDispatch()

  useEffect(() => {
    if(token == "" || token == null){
      dispatch({type: SET_AUTH_DETAILS, authdetails: {
          ...authDetailsState,
          status: false
      }})
    }
    else{
      verifyAuthToken()
    }
  },[])

  const verifyAuthToken = () => {
    Axios.get(`${URL}/auth/companyadmin/jwtchecker`, {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result)
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
      console.log(err)
    })
  }

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={authdetails.status == null? null: authdetails.status? <Navigate to='/home' /> : <Navigate to='/login' />} />
        <Route path='/login' element={authdetails.status == null? null: authdetails.status? <Navigate to='/home' /> : <Login />} />
        <Route path='/home/*' element={authdetails.status == null? null: authdetails.status? <Home /> : <Navigate to='/login' />} />
      </Routes>
    </div>
  );
}

export default App;

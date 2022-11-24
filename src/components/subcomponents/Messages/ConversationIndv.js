import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "../../../styles/subcomponents/ConversationIndv.css"
import SendIcon from '@material-ui/icons/Send'
import AttachIcon from '@material-ui/icons/AttachFile'
import DefaultImg from '../../../resources/imgs/defaultimg.png'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import { useDispatch, useSelector } from 'react-redux'
import { SET_MESSAGES } from '../../../redux/types'
import { messagesState } from '../../../redux/actions'

function ConversationIndv({convFilter, filterType}) {

  const messages = useSelector(state => state.messages)
  const params = useParams()
  const dispatch = useDispatch()
  
  useEffect(() => {
    // console.log(params)
    initConversation()

    return () => {
        dispatch({ type: SET_MESSAGES, messages: messagesState })
    }
  },[params])

  const initConversation = () => {
    Axios.get(`${URL}/messages/initConversationCompany/${params.conversationID}`, {
        headers:{
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => {
        if(response.data.status){
            // console.log(response.data.result)
            dispatch({ type: SET_MESSAGES, messages: response.data.result })
        }
        else{
            console.log(response.data.result)
        }
    }).catch((err) => {
        console.log(err)
    })
  }

  return (
    <div id='div_conversationindv'>
        <div id='div_conversationindv_header'>
            <div id='div_img_person_label_holder'>
                <img src={messages.userDetails.preview == "none"? DefaultImg : messages.userDetails.preview} id='img_convind_prev' />
                <div id='div_user_labels'>
                    <p id='p_person_label'>{messages.userDetails.userDisplayName}</p>
                    <p id='p_usertype_label'>{
                        messages.userDetails.userType == "systemAdmin"? "System Admin" : 
                        messages.userDetails.userType == "companyAdmin"? "Company" : 
                        messages.userDetails.userType == "driver"? "Driver" : 
                        messages.userDetails.userType == "commuter"? "Commuter" : ""
                    }</p>
                </div>
            </div>
            <div id='div_flexed_area_header' />
            <div>
                <p>Info</p>
            </div>
        </div>
        <div id='div_conversationindv_chats'>
            <p>Hello World</p>
        </div>
        <div id='div_conversationindv_input'>
            <input type='text' placeholder='Type something...' id='input_message' />
            <div id='div_buttons_message'>
                <button className='btns_message'><AttachIcon style={{color: "#2F2F2F"}} /></button>
                <button className='btns_message'><SendIcon style={{color: "#EBA400"}} /></button>
            </div>
        </div>
    </div>
  )
}

export default ConversationIndv
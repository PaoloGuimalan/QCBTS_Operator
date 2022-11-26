import React, { useEffect, useRef, useState } from 'react'
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
import { motion } from 'framer-motion'

function ConversationIndv({convFilter, filterType}) {

  const authdetails = useSelector(state => state.authdetails)
  const messages = useSelector(state => state.messages)
  const params = useParams()
  const dispatch = useDispatch()

  let cancelAxios;

  const scrollHeightDiv = useRef(null);
  
  useEffect(() => {
    // console.log(params)
    initConversation()

    return () => {
        dispatch({ type: SET_MESSAGES, messages: messagesState })
        cancelAxios.cancel();
    }
  },[params.conversationID])

  const subscribeMessagesConvo = () => {
    cancelAxios = undefined
    if(typeof cancelAxios != typeof undefined){
        cancelAxios.cancel()
        subscribeMessagesConvo()
    }
    else
    {
        cancelAxios = Axios.CancelToken.source()
        Axios.get(`${URL}/messages/subscribeMessagesConvo`, {
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
            initConversation()
          }
          else{
            //also run init commands
            // cancelAxios()
            // subscribeMessages()
            initConversation()
          }
        }).catch((err) => {
          // cancelAxios()
          // subscribeMessages()
          if(err.message != 'canceled'){
            cancelAxios = undefined;
            subscribeMessagesConvo()
            // initConversation()
            // console.log(err)
          }
          // console.log(err)
        })
    }
  }

  const initConversation = () => {
    Axios.get(`${URL}/messages/initConversationCompany/${params.conversationID}`, {
        headers:{
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => {
        if(response.data.status){
            // console.log(response.data.result)
            dispatch({ type: SET_MESSAGES, messages: response.data.result })
            subscribeMessagesConvo()
            scrollToBottom()
        }
        else{
            console.log(response.data.result)
            subscribeMessagesConvo()
        }
    }).catch((err) => {
        console.log(err)
    })
  }

  useEffect(() => {
    // console.log(scrollHeightDiv.current)
    scrollToBottom()
  },[params.conversationID])

  const scrollToBottom = () => {
    scrollHeightDiv.current.scrollTo(0, scrollHeightDiv.current.scrollHeight)
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
        <div id='div_conversationindv_chats' ref={scrollHeightDiv}>
            {messages.conversation.map((chts, i) => {
                return(
                    <motion.p
                    initial={{
                        scale: 0.1,
                        marginLeft: chts.from.userID == authdetails.userID? "auto" : "10px",
                        backgroundColor: chts.from.userID == authdetails.userID? "#EBA400" : "#294072",
                        borderRadius: chts.from.userID == authdetails.userID? "10px 0px 10px 10px" : "0px 10px 10px 10px"
                    }}
                    animate={{
                        scale: 1,
                        transition:{
                          duration: 0.3
                        }
                    }}
                    key={i} className='p_messages_indv'>{chts.content}</motion.p>
                )
            })}
        </div>
        <div id='div_conversationindv_input'>
            <input type='text' placeholder='Type a message here...' id='input_message' />
            <div id='div_buttons_message'>
                <button className='btns_message'><AttachIcon style={{color: "#2F2F2F"}} /></button>
                <button className='btns_message'><SendIcon style={{color: "#EBA400"}} /></button>
            </div>
        </div>
    </div>
  )
}

export default ConversationIndv
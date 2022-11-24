import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './../../../styles/subcomponents/ConversationList.css'
import { motion } from 'framer-motion'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import { useDispatch, useSelector } from 'react-redux'
import { SET_CONVERSATIONS } from '../../../redux/types'
import { conversationsState } from '../../../redux/actions'
import LoadingIcon from '@material-ui/icons/Loop'
import EmptyIcon from '@material-ui/icons/ChatBubbleOutline'
import DefaultImg from '../../../resources/imgs/defaultimg.png'

function ConversationList({ convFilter, filterType }) {

  const authdetails = useSelector(state => state.authdetails)
  const conversations = useSelector(state => state.conversations)

  const [selectedConv, setselectedConv] = useState("none");
  const [loading, setloading] = useState(true);

  const dispatch = useDispatch()
  const params = useLocation();

  useEffect(() => {
    initConversationList()

    return () => {
        setloading(true)
        dispatch({ type: SET_CONVERSATIONS, conversations: conversationsState })
    }
  },[params.pathname.split("/")[3]])

  const initConversationList = () => {
    Axios.get(`${URL}/messages/caconversationlist/${filterType}`, {
        headers:{
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => {
        if(response.data.status){
            // console.log(response.data.result)
            dispatch({ type: SET_CONVERSATIONS, conversations: response.data.result })
            setloading(false)
        }
        else{
            console.log(response.data.result)
        }
    }).catch((err) => {
        console.log(err)
    })
  }

  const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <div id='div_conversationlist'>
        {loading? (
            <div id='div_loading_container'>
                <motion.div
                animate={{
                    rotate: -360,
                    transition:{
                      repeat: Infinity,
                      duration: 1,
                      repeatDelay: 0
                    }
                  }}
                id='div_loading_rotate_holder'>
                    <LoadingIcon style={{fontSize: "30px", color: "#C0C0C0"}} />
                </motion.div>
            </div>
        ) : (
            conversations.conversations.length == 0? (
                <div id='div_empty_label'>
                    <EmptyIcon style={{fontSize: "70px", color: "#C0C0C0"}} />
                    <p id='p_empty_label'>No Conversations yet</p>
                </div>
            ) : (
                <div id='div_indv_conversation_container'>
                    {conversations.conversations.map((cnv, i) => {
                        return(
                            <Link to={`/home/messages/${convFilter}/ex/${cnv.conversationID}`} key={i} onClick={() => { setselectedConv(cnv.conversationID) }} className='link_indv_conversation' style={{backgroundColor: selectedConv == cnv.conversationID? "white" : "transparent", color: selectedConv == cnv.conversationID? "black" : "white"}}>
                                <div className='div_extended_conversation_layout'>
                                    <div id='div_indv_conversation'>
                                        {conversations.profiles.map((prf, i) => {
                                                return(
                                                    cnv.from.userID == prf.userID || cnv.to.userID == prf.userID? (
                                                        <img src={prf.preview == "none"? DefaultImg : prf.preview} className='img_conversation_prompts' />
                                                    ) : null
                                                )
                                            })}
                                        <div className='div_user_flexed'>
                                            {conversations.profiles.map((prf, i) => {
                                                return(
                                                    cnv.from.userID == prf.userID || cnv.to.userID == prf.userID? (
                                                        <p key={i} className='p_name_label'>{prf.userDisplayName}</p>
                                                    ) : null
                                                )
                                            })}
                                            <p className='p_prev_label'>{cnv.from.userID == authdetails.userID? `you: ${cnv.content}` : cnv.content}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )
        )}
    </div>
  )
}

export default ConversationList